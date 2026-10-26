#!/usr/bin/env bash
set -Eeuo pipefail

# =========================================================
# WSL Linux Setup
# Zsh + Oh My Zsh + Plugins + asdf + Starship
# Compatível com Ubuntu/Debian no WSL
# =========================================================

if [[ "${EUID}" -eq 0 ]]; then
  echo "Execute como seu usuário normal, sem sudo no script inteiro."
  exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "Este script é compatível apenas com distribuições baseadas em Debian/Ubuntu."
  exit 1
fi

if ! grep -qi microsoft /proc/version 2>/dev/null; then
  echo "Este script é compatível apenas com o WSL (Windows Subsystem for Linux)."
  exit 1
fi

ZSH_CUSTOM="${HOME}/.oh-my-zsh/custom"
ASDF_DIR="${HOME}/.asdf"
CONFIG_DIR="${HOME}/.config"
STARSHIP_CONFIG="${CONFIG_DIR}/starship"

echo "===> [1/8] Instalando dependências..."
sudo apt-get update -y
sudo apt-get install -y \
  zsh \
  git \
  curl \
  wget \
  ca-certificates \
  unzip \
  zip \
  build-essential \
  autoconf \
  libssl-dev \
  libreadline-dev \
  zlib1g-dev \
  libyaml-dev \
  libffi-dev \
  libncurses-dev \
  xz-utils \
  tk-dev \
  libsqlite3-dev \
  uuid-dev \
  dirmngr \
  gpg \
  software-properties-common

echo "===> [2/8] Instalando Oh My Zsh..."

if [[ ! -d "${HOME}/.oh-my-zsh" ]]; then
  RUNZSH=no CHSH=no KEEP_ZSHRC=yes \
    sh -c "$(curl -fsSL \
    https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
    "" --unattended
else
  echo "Oh My Zsh já instalado."
fi

mkdir -p "${ZSH_CUSTOM}/plugins"

echo "===> [3/8] Instalando plugins do Oh My Zsh..."

install_plugin() {
  local repo="$1"
  local name="$2"
  local destination="${ZSH_CUSTOM}/plugins/${name}"

  if [[ -d "${destination}/.git" ]]; then
    echo "Atualizando ${name}..."
    git -C "${destination}" pull --ff-only
  elif [[ -d "${destination}" ]]; then
    echo "Diretório ${name} já existe; preservando."
  else
    git clone --depth=1 "${repo}" "${destination}"
  fi
}

install_plugin \
  https://github.com/zsh-users/zsh-autosuggestions.git \
  zsh-autosuggestions

install_plugin \
  https://github.com/zsh-users/zsh-completions.git \
  zsh-completions

install_plugin \
  https://github.com/zsh-users/zsh-syntax-highlighting.git \
  zsh-syntax-highlighting

echo "===> [4/8] Instalando asdf..."

# Instalação pelo repositório oficial.
# Ajuste a versão conforme a versão estável desejada.
ASDF_VERSION="v0.20.2"

if [[ ! -d "${ASDF_DIR}/.git" ]]; then
  if [[ -e "${ASDF_DIR}" ]]; then
    echo "O caminho ${ASDF_DIR} já existe e não é um clone Git."
    echo "Preservando o conteúdo. Verifique a instalação manualmente."
  else
    git clone https://github.com/asdf-vm/asdf.git \
      "${ASDF_DIR}" --branch "${ASDF_VERSION}" --depth 1
  fi
else
  echo "asdf já existe em ${ASDF_DIR}."
fi

echo "==> [5/8] Instalando Starship..."

if ! command -v starship >/dev/null 2>&1; then
  curl -fsSL https://starship.rs/install.sh -o /tmp/starship-install.sh
  sh /tmp/starship-install.sh -y
  rm -f /tmp/starship-install.sh
else
  echo "Starship já instalado."
fi

echo "==> [6/8] Configurando Starship..."

mkdir -p "${CONFIG_DIR}"

# Preserva a configuração anterior.
if [[ -f "${STARSHIP_CONFIG}" ]] &&
   ! grep -q 'WSL Custom Starship Theme' "${STARSHIP_CONFIG}"; then
    cp "${STARSHIP_CONFIG}" \
        "${STARSHIP_CONFIG}.backup.$(date +%Y%m%d%H%M%S)"
fi

cat > "${STARSHIP_CONFIG}" <<'STARSHIP'
# WSL Custom Starship Theme

add_newline = true
command_timeout = 1000

format = """
[╭─](bold #7aa2f7)$os$username$hostname$directory$git_branch$git_status
[╰─](bold #7aa2f7)$character"""

[os]
disabled = false
format = "[$symbol ]($style)"
style = "bold #7dcfff"

[os.symbols]
Ubuntu = " "
Debian = " "

[username]
show_always = true
format = "[$user]($style)"
style_user = "bold #bb9af7"
style_root = "bold red"

[hostname]
ssh_only = false
format = "[@$hostname ]($style)"
style = "bold #7dcfff"

[directory]
style = "bold #7aa2f7"
format = "[ $path ]($style)"
truncation_length = 3
truncate_to_repo = true
read_only = " 󰌾"

[git_branch]
symbol = " "
format = "[ $symbol$branch ]($style)"
style = "bold #9ece6a"

[git_status]
format = "([$all_status$ahead_behind]($style) )"
style = "bold #e0af68"
conflicted = "✖"
ahead = "⇡${count}"
behind = "⇣${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
untracked = "?"
stashed = "$"
modified = "!"
staged = "+"
renamed = "»"
deleted = "✘"

[cmd_duration]
min_time = 2_000
format = "[took $duration]($style) "
style = "bold #e0af68"

[character]
success_symbol = "[❯](bold #9ece6a)"
error_symbol = "[❯](bold #f7768e)"
vimcmd_symbol = "[❮](bold #bb9af7)"

[package]
disabled = true

[time]
disabled = true
STARSHIP

echo "==> [7/8] Instalando fontes Nerd Font..."
echo "==> Instalando CaskaydiaCove Nerd Font no Windows..."
if [[ -n "${WSL_DISTRO_NAME:-}" ]] &&
   command -v powershell.exe >/dev/null 2>&1; then

    powershell.exe -NoProfile -Command '
        $ErrorActionPreference = "Stop"

        $font = "CaskaydiaCove Nerd Font"
        $fontKey = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"

        $installed = Get-ItemProperty -Path $fontKey -ErrorAction SilentlyContinue
        $alreadyInstalled = $installed -and (
            $installed.PSObject.Properties.Name |
            Where-Object { $_ -like "*CaskaydiaCove Nerd Font*" }
        )

        if ($alreadyInstalled) {
            Write-Host "CaskaydiaCove Nerd Font já instalada."
            exit 0
        }

        $tempDir = Join-Path $env:TEMP "CaskaydiaCoveNerdFont"
        $zipFile = Join-Path $tempDir "CascadiaCode.zip"
        $extractDir = Join-Path $tempDir "extracted"
        $fontDir = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"

        New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
        New-Item -ItemType Directory -Force -Path $extractDir | Out-Null
        New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

        try {
            Invoke-WebRequest `
                -Uri "https://github.com/ryanoasis/nerd-fonts/releases/latest/download/CascadiaCode.zip" `
                -OutFile $zipFile

            Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force

            $fonts = Get-ChildItem -Path $extractDir -Filter "*.ttf" -Recurse |
                Where-Object { $_.Name -like "*CaskaydiaCove*" }

            if (-not $fonts) {
                throw "Nenhum arquivo TTF CaskaydiaCove encontrado no pacote."
            }

            foreach ($file in $fonts) {
                $destination = Join-Path $fontDir $file.Name
                Copy-Item -Path $file.FullName -Destination $destination -Force

                $registryName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                $displayName = "$registryName (TrueType)"

                New-ItemProperty `
                    -Path $fontKey `
                    -Name $displayName `
                    -Value $destination `
                    -PropertyType String `
                    -Force | Out-Null
            }

            Write-Host "Fonte instalada para o usuário atual do Windows."
        }
        finally {
            Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    '

    echo "Confira a mensagem do PowerShell acima."
else
    echo "Não foi possível acessar o PowerShell do Windows."
    echo "Instale a fonte manualmente: https://www.nerdfonts.com/font-downloads"
fi

echo "==> Verificando CaskaydiaCove Nerd Font no Ubuntu..."

FONT_DIR="${HOME}/.local/share/fonts"
FONT_CACHE_DIR="${FONT_DIR}/CaskaydiaCove"
FONT_TEMP_DIR="$(mktemp -d)"

cleanup_font_temp() {
    rm -rf "${FONT_TEMP_DIR}"
}
trap cleanup_font_temp EXIT

# Garante que o fontconfig esteja disponível.
if ! command -v fc-list >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y fontconfig
fi

# Verifica se a fonte já está disponível no Ubuntu.
if fc-list 2>/dev/null | grep -qi "CaskaydiaCove Nerd Font"; then
    echo "CaskaydiaCove Nerd Font já instalada no Ubuntu."
else
    echo "Fonte não encontrada no Ubuntu. Instalando..."

    mkdir -p "${FONT_DIR}" "${FONT_CACHE_DIR}"

    curl -fL \
        "https://github.com/ryanoasis/nerd-fonts/releases/latest/download/CascadiaCode.zip" \
        -o "${FONT_TEMP_DIR}/CascadiaCode.zip"

    unzip -q "${FONT_TEMP_DIR}/CascadiaCode.zip" \
        -d "${FONT_TEMP_DIR}/extracted"

    find "${FONT_TEMP_DIR}/extracted" \
        -type f -iname '*CaskaydiaCove*.ttf' \
        -exec cp -f {} "${FONT_CACHE_DIR}/" \;

    if ! find "${FONT_CACHE_DIR}" -type f -iname '*.ttf' \
        -print -quit | grep -q .; then
        echo "ERRO: nenhum arquivo TTF CaskaydiaCove foi encontrado."
        exit 1
    fi

    fc-cache -f "${FONT_CACHE_DIR}"

    if fc-list 2>/dev/null | grep -qi "CaskaydiaCove Nerd Font"; then
        echo "Fonte instalada com sucesso no Ubuntu."
    else
        echo "Aviso: os arquivos foram copiados, mas o fontconfig não confirmou a fonte."
    fi
fi

echo "==> Verificação da fonte concluída."

echo "==> [8/8] Configurando .zshrc..."

ZSHRC="${HOME}/.zshrc"

if [[ ! -f "${ZSHRC}" ]]; then
    touch "${ZSHRC}"
fi

# Backup antes de modificar a configuração.
cp "${ZSHRC}" "${ZSHRC}.backup.$(date +%Y%m%d%H%M%S)"

# Remove somente o bloco gerenciado por este script.
# Isso evita duplicação em execuções futuras.
python3 - "${ZSHRC}" <<'PY'
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
text = path.read_text()

start = "# >>> WSL CUSTOM SETUP >>>"
end = "# <<< WSL CUSTOM SETUP <<<"

if start in text and end in text:
    before, rest = text.split(start, 1)
    _, after = rest.split(end, 1)
    text = before.rstrip() + "\n\n" + after.lstrip()

path.write_text(text)
PY

# Desativa o tema do Oh My Zsh para que Starship controle o prompt.
if grep -q '^ZSH_THEME=' "${ZSHRC}"; then
    sed -i 's/^ZSH_THEME=.*/ZSH_THEME=""/' "${ZSHRC}"
fi

# Atualiza a lista de plugins do Oh My Zsh.
if grep -q '^plugins=' "${ZSHRC}"; then
    sed -i \
        's/^plugins=.*/plugins=(git asdf zsh-autosuggestions zsh-completions zsh-syntax-highlighting)/' \
        "${ZSHRC}"
else
    echo 'plugins=(git asdf zsh-autosuggestions zsh-completions zsh-syntax-highlighting)' \
        >> "${ZSHRC}"
fi

cat >> "${ZSHRC}" <<'ZSHCONFIG'

# >>> WSL CUSTOM SETUP >>>

# Carrega o Oh My Zsh.
export ZSH="$HOME/.oh-my-zsh"
if [[ -s "$ZSH/oh-my-zsh.sh" ]]; then
    source "$ZSH/oh-my-zsh.sh"
fi

# Caminhos do asdf (instalação oficial via Git).
export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"

# Autocompletar adicional do Zsh.
if [[ -d "$ZSH_CUSTOM/plugins/zsh-completions/src" ]]; then
    fpath=("$ZSH_CUSTOM/plugins/zsh-completions/src" $fpath)
fi

# Starship como prompt principal.
if command -v starship >/dev/null 2>&1; then
    eval "$(starship init zsh)"
fi

# <<< WSL CUSTOM SETUP <<<
ZSHCONFIG

echo "==> Configurando o Zsh como shell padrão..."

ZSH_PATH="$(command -v zsh)"

if ! grep -qxF "${ZSH_PATH}" /etc/shells; then
    echo "O caminho ${ZSH_PATH} não consta em /etc/shells."
    echo "Solicitando inclusão para permitir chsh..."
    echo "${ZSH_PATH}" | sudo tee -a /etc/shells >/dev/null
fi

if [[ "${SHELL:-}" != "${ZSH_PATH}" ]]; then
    chsh -s "${ZSH_PATH}" || \
        echo "Não foi possível alterar o shell padrão automaticamente."
fi

echo
echo "============================================"
echo " Instalação concluída!"
echo "============================================"
echo
echo "Feche e abra o terminal WSL novamente."
echo
echo "Verifique as versões com:"
echo "  zsh --version"
echo "  starship --version"
echo "  asdf --version"
echo
echo "Para usar o asdf, instale um plugin de linguagem."
echo "Exemplo: asdf plugin list all"
echo
echo "IMPORTANTE: selecione uma Nerd Font no Windows Terminal"
echo "para visualizar corretamente os ícones do Starship."
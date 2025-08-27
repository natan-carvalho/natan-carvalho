#!/bin/bash

# Install Tools
apt update && apt install build-essential unzip -y
apt install unzip -y

cd ~/

# Download latest version
curl -LO https://github.com/neovim/neovim/releases/download/v0.11.3/nvim-linux-x86_64.tar.gz

# Extract
tar -xzf nvim-linux-x86_64.tar.gz

# Move for /opt (or other global folder)
mv nvim-linux-x86_64 /opt/nvim

# Create simbol link
ln -sf /opt/nvim/bin/nvim /usr/local/bin/v

# Check version
v --version

# Install LazyVim
git clone https://github.com/LazyVim/starter ~/.config/nvim

# Remove the .git
rm -rf ~/.config/nvim/.git


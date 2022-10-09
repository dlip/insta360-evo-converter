{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { self
    , nixpkgs
    , flake-utils
    }:
    flake-utils.lib.eachDefaultSystem
      (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      rec {
        inherit pkgs;
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-16_x
            ffmpeg
          ];
          shellHook = with pkgs; ''
            export PATH=$(pwd)/node_modules/.bin:$PATH
          '';
        };
      });
}


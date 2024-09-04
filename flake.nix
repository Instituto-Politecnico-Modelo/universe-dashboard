{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: 
      let
        pkgs = nixpkgs.legacyPackages.${system};
        pname = "dashboard"; # <same as package.json name>
        version = "0.1.0";
        buildInputs = with pkgs; [
          nodejs_20
          nodePackages_latest.pnpm
        ];
        nativeBuildInputs = buildInputs;
        npmDepsHash = "sha256-1MRVgwsTpiZ9VFPn7aiAUW3fhmLaHYZXS0kkbLINlac="; # <prefetch-npm-deps package-lock.json>

      in
      {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
        default = pkgs.buildNpmPackage {
          inherit pname version buildInputs npmDepsHash nativeBuildInputs;
          src = ./.;
          postInstall = ''
            mkdir -p $out/bin
            exe="$out/bin/${pname}"
            lib="$out/lib/node_modules/${pname}"
            cp -r ./.next $lib
            touch $exe
            chmod +x $exe
            echo "
                #!/usr/bin/env bash
                cd $lib
                ${pkgs.nodePackages_latest.pnpm}/bin/pnpm run start" > $exe
          '';
        };
      });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  devcontainer.enable = true;
                  # https://devenv.sh/reference/options/
                  languages.javascript = {
                    enable = true;
                    bun = {
                      enable = true;
                      install.enable = true;
                    };
                    
                  };

                  services.mongodb = {
                    enable = true;
                  };

                  enterShell = ''
                  echo "Dashboard devshell>>"
                  '';

                }
              ];
            };
          });
    };
}

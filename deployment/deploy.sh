#!/bin/bash
set -e


echo "Deployment Script"
echo "Esto va a sobreescribir el deployment actual"
echo "¿Esta seguro que desea hacerlo?"
echo "Yes (Y) or No (N)"

read conf
conf=${conf,,}

[[ "$conf" = "y" || "$conf" = "yes" ]] && run=1 || run=0

if [ $run = 1 ] 
then
    if ! command -v gomplate &> /dev/null
    then
        echo 'Gomplate no esta instalado.'
        echo 'Instalando via Sudo (Insertar Pass si corresponde):'
        sudo curl -o /usr/local/bin/gomplate -L https://github.com/hairyhenderson/gomplate/releases/download/v3.11.5/gomplate_linux-amd64
        sudo chmod 755 /usr/local/bin/gomplate
    fi
    echo 'Construyendo deployment'
    gomplate --config .gomplate.yaml
    echo 'Deployment construido'
fi

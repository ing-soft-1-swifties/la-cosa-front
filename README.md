
# Como usar este repositorio:

1. Instalar NVM
    1. ___curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash___
    2. Cerrar la terminar y volver abrir. Es importante
2. Instalar la version de NodeJS correspondiente
    1. ___nvm install --lts___
3. Entrar a la carpeta next e instalar las dependencias del proyecto
    1. ___cd next___
    2. ___npm install___
4. Opcionalmente configurar la URL del servidor backend
    1. Si es para uso local ver que ___config.tsx___ tenga puesta la url _http://localhost:8000_
    2. Si es para uso no local (como una LAN) ver que ___config.tsx___ tenga configurada la url del servidor backend correspondiente, es decir, la ip donde se encuentra el servidor, por ejemplo _http://192.168.0.120:8000_
4. Finalmente iniciar el servidor
    1. ___npm run dev___


Realizados los pasos anteriores solo resta usar ___npm run dev___ en la carpeta ___next___ cada vez que se quiera iniciar el servidor
# ☀️ Projeto RETRACTA — Varal Automatizado Inteligente

O **RETRACTA** é um sistema IoT (Internet das Coisas) desenvolvido para automação residencial, focado na proteção de roupas em varais contra intempéries (como chuva). O projeto integra um aplicativo mobile em **React Native (Expo)**, banco de dados em tempo real (**Firebase Realtime Database**), API de clima externa (**OpenWeatherMap**) e controle de hardware via microcontrolador (**ESP32**).

---

## 📱 Funcionalidades do Aplicativo Mobile
* **Autenticação Segura:** Login de acesso integrado ao Firebase Auth.
* **Monitoramento Climático por GPS:** Captura automática da localização do usuário (via `expo-location`) para exibir o clima local em tempo real.
* **Controle Remoto de Hardware:** Envio de comandos manuais (`estender` / `retrair`) ou automáticos baseados no sensor de chuva.
* **Status em Tempo Real:** Sincronização instantânea com o ESP32 via Firebase Realtime Database.

---

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React Native, Expo, React Navigation, AsyncStorage.
* **Backend & Banco de Dados:** Firebase Realtime Database.
* **APIs Externas:** OpenWeatherMap API.
* **Hardware:** ESP32, Sensor de Chuva, Motor de Passo/DC.

---

## ⚙️ Guia de Instalação e Execução (Para Avaliadores)

Siga os passos abaixo caso deseje rodar o aplicativo em ambiente de desenvolvimento local:

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* Gerenciador de pacotes `npm` ou `yarn`
* Aplicativo **Expo Go** instalado no seu celular (disponível para Android e iOS)

### Passos para Executar:

1. **Clone o repositório ou descompacte a pasta do projeto:**
   ```bash
   cd retracta-app
- 
   **Instale as dependências do projeto:**
   npm install

  **Inicie o servidor de desenvolvimento do Expo:**
  npx expo start

  Abra no Dispositivo:

**Abra o aplicativo Expo Go no seu smartphone**.

Escaneie o QR Code exibido no terminal (ou na tela do navegador) (mas antes desligue o FireWall).

O aplicativo será carregado instantaneamente para testes.


retracta-app/
├── assets/              # Imagens, ícones e splash screen
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── config/          # Configuração do Firebase
│   └── screens/         # Telas principais (HomeScreen, Login, Configurações)
├── App.js               # Componente raiz e rotas principais
├── app.json             # Configurações do Expo e permissões nativas
└── package.json         # Dependências e scripts do projeto

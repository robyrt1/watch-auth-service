# Auth Service API

Microserviço centralizado responsável por toda a gestão de identidade e autenticação de usuários, incluindo registro, login e validação de sessão via JWT.

##

Este projeto foi desenhado com base nos princípios da **Arquitetura Limpa (Clean Architecture)** e do **Domain-Driven Design (DDD)**. Esta abordagem garante um baixo acoplamento, alta coesão e uma clara separação entre a lógica de negócio e as preocupações de infraestrutura.

  - **Padrão CQRS:** As responsabilidades são segregadas entre `Commands` (operações de escrita) e `Queries` (operações de leitura) para otimizar e escalar cada fluxo de trabalho de forma independente.
  - **Orientado a Eventos:** A arquitetura adota uma abordagem orientada a eventos com **RabbitMQ** para comunicação assíncrona, permitindo o desacoplamento entre este e outros microserviços.
  - **Estrutura de Camadas:**
      - **`domain/`**: O coração da aplicação. Contém as entidades de domínio (ex: User), regras de negócio, exceções e os contratos dos repositórios. É totalmente agnóstico a tecnologias externas.
      - **`application/`**: Camada que orquestra os fluxos e casos de uso. Contém os Handlers para os Commands e Queries.
      - **`infrastructure/`**: Implementações concretas de tecnologias externas, como persistência com PostgreSQL (TypeORM), mensageria com RabbitMQ e segurança.
      - **`interfaces/`**: A camada mais externa, responsável pela interação com o mundo exterior, primariamente através de uma API HTTP (Controllers, DTOs de requisição/resposta).

## ✨ Recursos

  - Registro de novos usuários com validação e hash de senha.
  - Autenticação de usuários e geração de token JWT.
  - Endpoint protegido para verificar os dados do usuário logado (`/me`).
  - Publicação de eventos de domínio (ex: `UserRegisteredEvent`) no RabbitMQ para notificar outros serviços.
  - Tracing distribuído com **OpenTelemetry** e **Jaeger** para monitoramento e depuração.

## 🚀 Começando

Siga as instruções para configurar e rodar o `auth-service` em seu ambiente local.

### Pré-requisitos

  - Node.js (v18 ou superior)
  - NPM ou Yarn
  - Docker e Docker Compose

### Instalação

1.  Clone o repositório e entre na pasta do projeto.

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente criando um arquivo `.env` na raiz, a partir do `.env.example`.

    ```.env
    # Database
      DATABASE_HOST=localhost
      DATABASE_PORT=5432
      DATABASE_USERNAME=watch
      DATABASE_PASSWORD=watch
      DATABASE_NAME=watch     

      # JWT
      JWT_SECRET=your_super_secret_jwt_key
      JWT_EXPIRES_IN=1h     
      

      # Jaeger
      JAEGER_AGENT_HOST=localhost
      JAEGER_AGENT_PORT=6832      
      

      # Rabbitmq
      RABBITMQ_HOST=localhost
      RABBITMQ_PORT=5672
      RABBITMQ_USER=guest
      RABBITMQ_PASSWORD=guest
      RABBITMQ_QUEUE=auth_events_queue      

      # Tracing
      OTEL_SERVICE_NAME=auth-service
    ```

### Rodando as Dependências com Docker

Este serviço depende de instâncias do PostgreSQL, RabbitMQ e Jaeger. Use os seguintes comandos para iniciá-las via Docker Compose a partir da raiz do projeto:

```bash
# Para iniciar o banco de dados PostgreSQL
docker compose -f postgres.docker-compose.yml up -d

# Para iniciar o broker de mensageria RabbitMQ
docker compose -f rabbitmq.docker-compose.yml up -d

# Para iniciar o coletor de traces do Jaeger
docker compose -f jaeger.docker-compose.yml up -d
```

### Rodando a Aplicação

Com as dependências rodando, inicie a API NestJS:

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## 🧪 Testes

Para rodar os testes unitários e de integração:

```bash
npm run test
```

Para rodar os testes end-to-end:

```bash
npm run test:e2e
```

## 📡 Endpoints da API

Endpoints principais expostos pela `AuthController`:

| Método | Rota             | Descrição                                         |
| :----- | :--------------- | :------------------------------------------------ |
| `POST` | `/auth/register` | Registra um novo usuário.                         |
| `POST` | `/auth/login`    | Autentica um usuário e retorna um token JWT.      |
| `GET`  | `/auth/me`       | Retorna os dados do usuário autenticado (protegido). |

## 🛠️ Tecnologias Utilizadas

  - **Framework:** NestJS, TypeScript
  - **Banco de Dados:** PostgreSQL, TypeORM
  - **Mensageria:** RabbitMQ
  - **Autenticação:** Passport.js, JWT, Bcrypt
  - **Observabilidade:** OpenTelemetry, Jaeger
  - **Contêineres:** Docker, Docker Compose
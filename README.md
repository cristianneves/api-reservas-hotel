# Reserva-API: Sistema de Reservas de Hotéis

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-blue?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)

Uma API RESTful completa construída com Node.js, Express e TypeScript para um sistema de reservas de quartos de hotel. O projeto segue uma arquitetura em camadas robusta, garantindo organização, testabilidade e escalabilidade.

## ✨ Funcionalidades

* **Autenticação e Autorização:**
    * Registro de novos usuários (clientes).
    * Login com geração de token JWT.
    * Controle de acesso baseado em papéis (roles): `user` e `admin`.
    * Middlewares de proteção para rotas autenticadas e rotas de administrador.

* **Gerenciamento de Hotéis (Admin):**
    * CRUD completo para hotéis.
    * Adição e remoção de comodidades (piscina, Wi-Fi, etc.) a um hotel.
    * Upload de imagem de capa para cada hotel, com armazenamento em nuvem (Cloudinary).

* **Gerenciamento de Quartos (Admin):**
    * CRUD completo para quartos, sempre associados a um hotel.

* **Sistema de Reservas (Usuários Autenticados):**
    * Criação de reservas com validação de disponibilidade de datas.
    * Cálculo automático do preço total baseado no número de diárias.
    * Visualização de reservas pessoais.
    * Cancelamento de reservas (com regra de negócio de 3 dias de antecedência).

* **Sistema de Avaliações (Usuários Autenticados):**
    * Usuários podem avaliar uma estadia após a data de check-out.
    * Cálculo automático da avaliação média e do número de avaliações do hotel a cada nova avaliação.

* **Busca e Consulta (Público):**
    * Busca avançada de quartos por cidade, faixa de preço e capacidade.
    * Listagem de hotéis, quartos e avaliações.
    * Consulta de disponibilidade de um quarto para um mês específico (formato de calendário).

* **Validação e Segurança:**
    * Validação de dados de entrada em todas as rotas relevantes usando Zod.
    * Tratamento de senhas com `bcryptjs`.
    * Gerenciamento seguro de credenciais com variáveis de ambiente (`dotenv`).

## 🏛️ Arquitetura

O projeto utiliza uma **Arquitetura em Camadas (Layered Architecture)** para garantir a **Separação de Responsabilidades (Separation of Concerns)**.

* **`routes`**: Define os endpoints da API e os conecta aos controllers e middlewares.
* **`middlewares`**: Funções que interceptam as requisições para tarefas como autenticação (`auth.middleware`), validação de dados (`validator` + `schemas`), tratamento de erros (`errorHandler`) e uploads de arquivos (`upload`).
* **`controllers`**: Recebem a requisição HTTP, delegam a lógica de negócio para os serviços e retornam a resposta ao cliente.
* **`services`**: O cérebro da aplicação. Contém toda a lógica de negócio, sendo totalmente independente do Express e do banco de dados.
* **`models`**: A camada de acesso a dados. Define os schemas do Mongoose e interage diretamente com o MongoDB.
* **`entities`**: Contém representações de objetos de negócio usando Programação Orientada a Objetos, como a classe `Comodidade`.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Linguagem:** TypeScript
* **Banco de Dados:** MongoDB com Mongoose
* **Autenticação:** JSON Web Token (JWT), bcryptjs
* **Validação:** Zod
* **Upload de Arquivos:** Multer, Cloudinary
* **Documentação:** Swagger

## 🚀 Como Executar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [MongoDB](https://www.mongodb.com/try/download/community) (uma instância local ou um cluster no MongoDB Atlas)
* Uma conta no [Cloudinary](https://cloudinary.com/) para o upload de imagens.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/reserva-api.git](https://github.com/seu-usuario/reserva-api.git)
cd reserva-api
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais, seguindo o exemplo abaixo:

```env
# Configuração do Banco de Dados
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sua-database

# Segredo para o JWT
JWT_SECRET=crie-um-segredo-forte-e-aleatorio-aqui

# Porta da Aplicação
PORT=3000

# Credenciais do Cloudinary
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

### 4. Iniciar a Aplicação
```bash
# Para ambiente de desenvolvimento com hot-reload
npm run dev

# Para ambiente de produção (após compilar o TypeScript)
npm run build
npm start
```

A API estará disponível em `http://localhost:3000`.

## 📚 Documentação da API (Endpoints)

A documentação completa da API, gerada com Swagger, está disponível no endpoint:
* `GET /api-docs`

### Principais Endpoints

A base de todas as URLs é `/api`.

#### Autenticação (`/auth`)
* `POST /registrar`: Registra um novo usuário.
* `POST /login`: Realiza o login e retorna um token JWT.

#### Hotéis (`/hoteis`)
* `GET /`: Lista todos os hotéis.
* `GET /:id`: Busca um hotel por ID.
* `POST /`: Cria um novo hotel (Admin).
* `PUT /:id`: Atualiza um hotel (Admin).
* `DELETE /:id`: Deleta um hotel (Admin).
* `PATCH /:id/imagem-de-capa`: Faz o upload da imagem de capa de um hotel (Admin).
* `POST /:hotelId/comodidades`: Adiciona uma comodidade a um hotel (Admin).

#### Quartos (`/quartos`)
* `GET /`: Lista todos os quartos.
* `GET /buscar`: Busca quartos com filtros (cidade, preço, capacidade).
* `GET /hotel/:hotelId`: Lista os quartos de um hotel específico.
* `POST /hotel/:hotelId`: Cria um novo quarto para um hotel (Admin).

#### Reservas (`/reservas`)
* `GET /minhas-reservas`: Lista as reservas do usuário autenticado.
* `POST /`: Cria uma nova reserva (Usuário Autenticado).
* `POST /:id/cancelar`: Cancela uma reserva (Usuário Autenticado).
* `GET /`: Lista todas as reservas do sistema (Admin).

---

**Autor:** Cristian

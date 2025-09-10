# Planejamento do Modelo de Dados

Este documento descreve o modelo de dados para a API de Reservas de Hotel. A persistência de dados é feita utilizando MongoDB, com a modelagem e interação gerenciadas pela biblioteca Mongoose.

O modelo é composto por quatro coleções principais: `usuarios`, `hoteis`, `quartos` e `reservas`.

## Coleção: `usuarios`

Armazena as informações dos usuários que podem se autenticar e fazer reservas no sistema.

| Campo | Tipo de Dado | Descrição | Regras/Observações |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único do usuário. | Gerado automaticamente pelo MongoDB. |
| `nome` | `String` | Nome completo do usuário. | Obrigatório. |
| `email` | `String` | E-mail de contato e login do usuário. | Obrigatório, único e em minúsculas. |
| `password` | `String` | Senha criptografada do usuário. | Obrigatório. O hash é gerado com Bcrypt antes de salvar. Não é retornado em consultas por padrão. |
| `role` | `String` | Cargo do usuário no sistema. | Obrigatório. Aceita "user" ou "admin". O valor padrão é "user". |
| `createdAt` | `Date` | Data e hora de criação do registro. | Gerado automaticamente. |
| `updatedAt` | `Date` | Data e hora da última atualização do registro. | Gerado automaticamente. |

## Coleção: `hoteis`

Armazena as informações sobre os hotéis disponíveis na plataforma.

| Campo | Tipo de Dado | Descrição | Regras/Observações |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único do hotel. | Gerado automaticamente pelo MongoDB. |
| `nome` | `String` | Nome do hotel. | Obrigatório. |
| `endereco`| `String` | Endereço físico do hotel. | Obrigatório. |
| `cidade` | `String` | Cidade onde o hotel está localizado. | Obrigatório. |
| `estado` | `String` | Estado onde o hotel está localizado. | Obrigatório. |
| `pais` | `String` | País onde o hotel está localizado. | Obrigatório. |
| `telefone`| `String` | Telefone de contato do hotel. | Obrigatório. |
| `email` | `String` | E-mail de contato do hotel. | Obrigatório e único. |
| `site` | `String` | Website oficial do hotel. | Opcional. |

## Coleção: `quartos`

Armazena os detalhes dos quartos, que são sempre associados a um hotel.

| Campo | Tipo de Dado | Descrição | Regras/Observações |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único do quarto. | Gerado automaticamente pelo MongoDB. |
| `hotelId` | `ObjectId` | ID do hotel ao qual o quarto pertence. | Obrigatório. Referencia a coleção `hoteis`. |
| `numero` | `String` | Número ou identificador do quarto (ex: "101", "Suíte Presidencial"). | Obrigatório. |
| `tipo` | `String` | Tipo do quarto. | Obrigatório. Enum: "SIMPLES", "DUPLO", "TRIPLO", "SUITE", "SUITE_CRIANCA". |
| `capacidade`| `Number` | Número máximo de hóspedes que o quarto acomoda. | Obrigatório. |
| `preco_diaria`|`Number` | Custo de uma diária no quarto. | Obrigatório. |

## Coleção: `reservas`

Armazena o registro de todas as reservas feitas no sistema.

| Campo | Tipo de Dado | Descrição | Regras/Observações |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Identificador único da reserva. | Gerado automaticamente pelo MongoDB. |
| `hotelId` | `ObjectId` | ID do hotel da reserva. | Obrigatório. Referencia a coleção `hoteis`. |
| `quartoId` | `ObjectId` | ID do quarto reservado. | Obrigatório. Referencia a coleção `quartos`. |
| `usuarioId`| `ObjectId` | ID do usuário que fez a reserva. | Obrigatório. Referencia a coleção `usuarios`. |
| `checkIn` | `Date` | Data e hora de início da reserva. | Obrigatório. |
| `checkOut` | `Date` | Data e hora de fim da reserva. | Obrigatório. |
| `precoTotal`| `Number` | Custo total da estadia, calculado no momento da criação. | Obrigatório. |
| `status` | `String` | Status atual da reserva. | Obrigatório. Enum: "CONFIRMADA", "CANCELADA". O valor padrão é "CONFIRMADA". |

## Relacionamentos

* Um **Hotel** pode ter vários **Quartos**. (Relação de um-para-muitos, implementada com o `hotelId` no modelo `Quarto`).
* Um **Quarto** pode ter várias **Reservas** (em datas diferentes). (Relação de um-para-muitos, implementada com o `quartoId` no modelo `Reserva`).
* Um **Usuário** pode ter várias **Reservas**. (Relação de um-para-muitos, implementada com o `usuarioId` no modelo `Reserva`).
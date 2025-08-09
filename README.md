# 🧪 DDD Tactical Modeling — Orders, Customers & Products

> **Goal:** Practice **Tactical Domain-Driven Design (DDD)** modeling with **TypeScript** + **Jest**.
> **Pitch for recruiters:** This repository is a compact sandbox where I model a simple commerce domain (**Customer**, **Product**, **Order**) and validate business rules through unit tests. The focus is on **tactical building blocks** — Entities, Value Objects, Aggregates, Domain Services, and Repositories.

---

## 🔎 What you’ll find here

- **Entities & Value Objects** — Rich models with behavior and business invariants.
- **Aggregates & Aggregate Roots** — Enforcing consistency across related entities.
- **Domain Services** — Encapsulating business rules that don’t belong to a single entity.
- **Repositories** — Interfaces for persistence, independent of infrastructure.
- **Tests as documentation** — Specs that clearly express expected behaviors.

---

## 📂 Folder structure


```
src/
-- domain/
---- entity/
------ address.ts
------ customer.spec.ts
------ customer.ts
------ order.spec.ts
------ order.ts
------ order_item.ts
------ product.spec.ts
------ product.ts
---- repository/
------ customer-repository.interface.ts
------ order-repository.interface.ts
------ product-repository.interface.ts
------ repository-interface.ts
---- service/
------ order.service.spec.ts
------ order.service.ts
------ product.service.spec.ts
------ product.service.ts
-- infrastructure/
---- db/
------ sequelize/
-------- model/
---------- customer.model.ts
---------- order.model.ts
---------- order-item.model.ts
---------- product.model.ts
---- repository/
------ customer.repository.spec.ts
------ customer.repository.ts
------ order.repository.spec.ts
------ order.repository.ts
------ product.repository.spec.ts
------ product.repository.ts
```



## 🧠 Tactical DDD concepts in action

- **Entities** → `Customer`, `Product`, `Order`
- **Value Objects** → `Address`, `OrderItem`
- **Aggregates** → `Order` as the Aggregate Root containing `OrderItems`
- **Domain Services** → `OrderService`, `ProductService` orchestrating domain rules
- **Repositories** → Domain contracts for persistence, implemented in the infrastructure layer

---

## 🚀 Running locally

> Requires **Node.js 22+** and npm.

```bash
# Install dependencies
npm install

# Run unit tests in watch mode
npm test

# Single run with coverage report
npm run test -- --coverage

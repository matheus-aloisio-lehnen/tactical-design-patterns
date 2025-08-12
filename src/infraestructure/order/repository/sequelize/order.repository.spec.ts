import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ CustomerModel, OrderModel, OrderItemModel, ProductModel ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [ orderItem ]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: [ "items" ],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("Should update an order (replacing items array)", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const product1 = new Product("p1", "Product 1", 10);
        const product2 = new Product("p2", "Product 2", 20);
        await productRepository.create(product1);
        await productRepository.create(product2);
        const orderItem1 = new OrderItem("i1", product1.name, product1.price, product1.id, 2);
        const order = new Order("o1", customer.id, [orderItem1]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        const orderItem1Updated = new OrderItem("i1", product1.name, product1.price, product1.id, 5);
        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 1);
        const updatedOrder = new Order(order.id, customer.id, [orderItem1Updated, orderItem2]);
        await orderRepository.update(updatedOrder);
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
            order: [[{ model: OrderItemModel, as: "items" }, "id", "ASC"]],
        });
        expect(orderModel.items).toHaveLength(2);
        const itemI1 = orderModel.items.find(i => i.id === "i1");
        const itemI2 = orderModel.items.find(i => i.id === "i2");
        expect(itemI1.quantity).toBe(5);
        expect(itemI2.name).toBe("Product 2");
    });

    it("should find an order by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 10);
        await productRepository.create(product);
        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        const foundOrder = await orderRepository.find("o1");
        expect(foundOrder.id).toBe(order.id);
        expect(foundOrder.items).toHaveLength(1);
        expect(foundOrder.items[0].name).toBe("Product 1");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const product1 = new Product("p1", "Product 1", 10);
        const product2 = new Product("p2", "Product 2", 20);
        await productRepository.create(product1);
        await productRepository.create(product2);
        const orderItem1 = new OrderItem("i1", product1.name, product1.price, product1.id, 1);
        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 3);
        const order1 = new Order("o1", customer.id, [orderItem1]);
        const order2 = new Order("o2", customer.id, [orderItem2]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);
        const orders = await orderRepository.findAll();
        expect(orders).toHaveLength(2);
        expect(orders.map(o => o.id)).toEqual(expect.arrayContaining(["o1", "o2"]));
    });
});

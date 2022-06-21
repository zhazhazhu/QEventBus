import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../src/index";

describe("hello EventBus", () => {
  it("should work", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn(() => {
      console.log("test1");
    });

    const fn2 = vi.fn(() => {
      console.log("test2");
    });

    eventBus.$on("test", fn1);

    eventBus.$on("test", fn2);

    eventBus.$emit("test");

    expect(fn1).toHaveBeenCalled();
  });

  it("pass Parameter", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn((val) => {
      console.log("我是", val);
      return val;
    });

    eventBus.$on("test", fn1);

    eventBus.$emit("test", "test");

    expect(fn1).toHaveLastReturnedWith("test");
  });

  it("off", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn(() => {
      console.log("EventBus off");
    });

    const id = eventBus.$on("test", fn1);

    expect(id).toBeTypeOf("number");

    eventBus.$off("test", id);

    eventBus.$emit("test", "test");

    expect(fn1).not.toHaveBeenCalled();
  });

  it("once", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn(() => {
      console.log("EventBus once");
    });

    const id = eventBus.$once("test", fn1);

    expect(id).toBeTypeOf("number");

    eventBus.$emit("test", "test");

    expect(fn1).toHaveBeenCalled();

    eventBus.$emit("test", "test");

    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it("once emit key more fn on", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn(() => {
      console.log("EventBus more key on1");
    });

    const fn2 = vi.fn(() => {
      console.log("EventBus more key on2");
    });

    eventBus.$on("test", fn1);

    eventBus.$on("test", fn2);

    eventBus.$emit("test");

    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  it("Instance Event Share", () => {
    const eventBus = new EventBus();

    const fn1 = vi.fn(() => {
      console.log("EventBus share 111");
    });

    const fn2 = vi.fn(() => {
      console.log("EventBus share 222");
    });

    eventBus.$on("test", fn1);

    eventBus.$on("test", fn2);

    const eventBus2 = new EventBus();

    eventBus2.$emit("test");

    expect(fn1).toHaveBeenCalled();
  });
});

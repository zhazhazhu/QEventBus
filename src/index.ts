const events: Map<string, Map<number | string, Function[]>> = new Map();

let eventId: number = 0;

export class EventBus {
  constructor() {}

  $on(name: string, cb: (...arg) => void) {
    return setEvents(name, cb, false, this);
  }

  $once(name: string, cb: (...arg) => void) {
    return setEvents(name, cb, true, this);
  }

  $emit(name: string, ...arg) {
    const listeners = events.get(name);

    if (!listeners || listeners?.size === 0) {
      return;
    }

    for (const val of listeners.values()) {
      val.forEach((fn) => fn(...arg));
    }
  }

  $off(name: string, id?: string | number) {
    const listeners = events.get(name);

    if (!listeners || listeners?.size === 0 || !id) {
      return;
    }

    listeners.delete(id);
  }

  $reset(name: string) {
    events.delete(name);
  }
}

function setEvents(
  name: string,
  cb: (...arg) => void,
  once: boolean,
  instance?: EventBus
) {
  const listeners = events.get(name) || new Map();

  if (!listeners || listeners?.size === 0) {
    events.set(name, new Map());
  }

  if (once) {
    const fn = () => {
      cb();
      instance?.$off(name, id);
    };

    const id = setEvents(name, fn, false);

    return id;
  } else {
    const id = eventId++;

    if (!listeners.has(id)) {
      listeners.set(id, []);
    }

    listeners.set(id, [cb, ...listeners.get(id)]);

    events.set(name, listeners);

    return id;
  }
}

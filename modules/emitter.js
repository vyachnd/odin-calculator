class Emitter {
  constructor() { this.events = new Map(); }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [callback]);
    } else {
      const callbacks = this.events.get(eventName);

      if (!callbacks.includes(callback)) callbacks.push(callback);
    }

    return () => this.unsubscribe(eventName, callback);
  }

  unsubscribe(eventName, callback) {
    if (!this.events.has(eventName)) return false;

    const callbacks = this.events.get(eventName);
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
      return true;
    }

    return false;
  }

  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return false;

    const callbacks = this.events.get(eventName);

    callbacks.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(error);
      }
    });

    return true;
  }
}

export default Emitter;

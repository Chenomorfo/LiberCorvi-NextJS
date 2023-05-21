export let ws;

(async () => {
  try {
    ws = await new WebSocket("ws://192.168.1.116:3100/ws");
  } catch (error) {
    console.log(error);
  }
})();

export const option = {
  type: "function",
  function: {
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    name: "get_current_time",
    description: "得到现在的时间",
  },
};

export async function execute(arg: { [key: string]: any }) {
  return new Date().toLocaleString();
}

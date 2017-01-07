
async function test() {
  return new Promise((resolve, reject) => {
    resolve(true);
  })
}

async function test_result() {
  const result = await test();
  return result;
}

export { test_result };

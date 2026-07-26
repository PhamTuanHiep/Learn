const ListPromise = () => {
  // Promise.resolve("Hiệp nè").then((value) => {
  //   console.log("Promise resolved with value:", value);
  // });
  // Promise.reject("huhu").catch((error) => {
  //   console.log("Promise rejected with error:", error);
  // });

  // console.log(1);

  // setTimeout(function () {
  //   console.log(2);
  // }, 0);

  // Promise.resolve()
  //   .then(function () {
  //     console.log(3);
  //   })
  //   .then(function () {
  //     console.log(4);
  //   });

  // console.log("begins");

  // setTimeout(() => {
  //   console.log("setTimeout 1");
  //   Promise.resolve().then(() => {
  //     console.log("promise 1");
  //   });
  // }, 0);

  // new Promise(function (resolve, reject) {
  //   console.log("promise 2");
  //   setTimeout(function () {
  //     console.log("setTimeout 2");
  //     resolve("resolve 1");
  //   }, 0);
  // }).then((res) => {
  //   console.log("dot then 1");
  //   setTimeout(() => {
  //     console.log(res);
  //   }, 0);
  // });
  async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
  }

  async function async2() {
    console.log("async2 start");
    await new Promise<void>((resolve) => {
      console.log("async2 promise");
      setTimeout(() => {
        console.log("async2 setTimeout");
        resolve() 
      }, 0);
    });
    console.log("async2 end");
  }
  async1();

  return (
    <div>
      <button>Click to run</button>
    </div>
  );
};
export default ListPromise;

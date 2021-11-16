async function run(links: string[], callback: (result: any) => void) {
    function transformInPromise(link: string, prevRes: any) {
      return fetch(link)
        .then((res) => res.json())
        .then((res) => {
          console.log('PREV res', prevRes);
          return res;
        })
        .then((res) => [...prevRes, res]);
    }

    const seqFetches = function (links: string[]) {
      return links.reduce(function (promise: any, link: any) {
        return promise.then(function (res: any) {
          return transformInPromise(link, res);
        });
      }, Promise.resolve([]));
    };
    seqFetches(links).then((res: any) => callback(res));
  }

run(links, (res) => console.log(res));

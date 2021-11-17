async function run(links: string[], callback: (result: any) => void) {
    function transformInPromise(link: string, prevRes: any) {
      if (prevRes)
        return fetch(link)
          .then((res) => {
            if (res.ok !== 200) {
              return Promise.reject();
            } else {
              return res.json();
            }
          })
          .then((res) => [...prevRes, res]);
    }

    const seqFetches = function (links: string[]) {
      return links.reduce(function (promise: any, link: any) {
        return promise
          .then(function (res: any) {
            return transformInPromise(link, res);
          })
          .catch(callback);
      }, Promise.resolve([]));
    };
    seqFetches(links).then(callback);
  }

run(links, (res) => console.log(res));

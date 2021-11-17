async function run(links: string[], limit: number) {
    const linksMap = new Map();

    const asyncFetch = (link: any) => {
      return fetch(link)
        .then((res) => res.json())
        .catch((err) => err);
    };

    //создаем массив из ссылка-индекс
    const linksWithIndexes = links.map((link, index) => ({ link, index }));
    //создаем массив для результатов
    const result = new Array(links.length);
    //создаем массив зарезолвенных промисов
    const promises = new Array(limit).fill(Promise.resolve());

    function chainNext(p: any) {
      if (linksWithIndexes.length) {
        const arg = linksWithIndexes.shift();
        return p.finally(() => {
          if (linksMap.has(arg?.link)) {
            result[arg.index] = linksMap.get(arg?.link);
            return chainNext(Promise.resolve());
          } else {
            const operationPromise = asyncFetch(arg?.link).then((r) => {
              result[arg.index] = r;
              linksMap.set(arg?.link, r);
            });
            return chainNext(operationPromise);
          }
        });
      }
      return p;
    }
    await Promise.all(
      promises.map((p) => {
        chainNext(p);
      }),
    );
    return result;
}

async function run(links: string[], limit: number) {
    const linksMap = new Map();

    const asyncFetch = (link: any) => {
      return fetch(link)
        .then((res) => res.json())
        .catch((err) => err);
    };

    //создаем массив из ссылка-индекс
    const argsCopy = links.map((link, index) => ({ link, index }));
    //создаем массив для результатов
    const result = new Array(links.length);
    //создаем массив зарезолвенных промисов
    const promises = new Array(limit).fill(Promise.resolve());

    function chainNext(p: any) {
      console.log('Вызвалась функция');
      if (argsCopy.length) {
        const arg = argsCopy.shift();
        return p.then(() => {
          if (linksMap.has(arg?.link)) {
            result[arg.index] = linksMap.get(arg?.link);
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
    await Promise.all(promises.map(chainNext));
    return result;
  }

(function (Scratch) {
    "use strict";
    class YandexApiExtension {
      getInfo() {
        console.log(
          "Расширение Yandex Api TurboWarp созданно  scratch_craft_2 при использовании яндекс нейро",
        );
        return {
          id: "YaApi",
          name: "Яндекс Api",
          color1: "#ff6161",
          blocks: [
            {
              opcode: "sendYaGPTRequest",
              blockType: Scratch.BlockType.REPORTER,
              text: "Получить ответ от YandexGPT [ApiKeyBlock] [Prompt]",
              arguments: {
                ApiKeyBlock: {
                  defaultValue: "YOUR_API_KEY",
                  type: Scratch.ArgumentType.STRING,
                },
                Prompt: {
                  defaultValue: "",
                  type: Scratch.ArgumentType.STRING,
                },
              },
            },            
            {
              opcode: "getYandexSearchResults",
              blockType: Scratch.BlockType.REPORTER,
              text: "Получить ссылки на яндекс поиске [ApiKeyBlock] [Query] ",
              arguments: {
                ApiKeyBlock: {
                  defaultValue: "YOUR_API_KEY",
                  type: Scratch.ArgumentType.STRING,
                },
                Query: {
                  defaultValue: "Youtube",
                  type: Scratch.ArgumentType.STRING,
                },
              },
            }
          ],
        };
      }
sendYaGPTRequest() {
    try {
        // Ваши параметры запроса
        const apiKey = [args.ApiKeyBlock]; // Замените на ваш API ключ
        const model = 'yandexgpt'; // Модель для использования
        const prompt = [args.Prompt]
        
        // Параметры запроса
        const params = {
            messages: [
                {
                    role: 'user',
                    text: prompt
                }
            ],
            model
        };

        // Отправляем POST запрос
        const response = await fetch('https://api.cloud.yandex.net/ai/text/completion/v1/completion', {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        // Проверяем успешность запроса
        if (!response.ok) {
            throw new Error(`Ошибка при запросе к API: ${response.statusText}`);
        }

        // Получаем ответ
        const data = await response.json();
        return data.choices[0].text;

    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    }
}

getYandexSearchResults() {
    try {
        // Ваш API ключ от Yandex Search API
        const apiKey = [args.ApiKeyBlock];
        
        // Параметры запроса
        const params = {
            query: [args.Query],   // поисковый запрос
            lr: 10943,             // регион поиска (Россия)
            lang: 'ru_RU',         // язык выдачи
            sortby: 'relevance',   // сортировка по релевантности
            page: 1,               // номер страницы
            filter: 1,             // фильтрация дубликатов
            max_results: 10        // количество результатов
        };

        // Формируем URL запроса
        const url = `https://yandex.ru/search/xml?`;
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}key=${apiKey}&${queryString}`;

        // Отправляем GET запрос
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Проверяем успешность запроса
        if (!response.ok) {
            throw new Error(`Ошибка при запросе к API: ${response.statusText}`);
        }

        // Получаем и парсим XML ответ
        const xml = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        
        // Извлекаем результаты поиска
        const results = [];
        const items = xmlDoc.getElementsByTagName('doc');
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const title = item.getElementsByTagName('title')[0].textContent;
            const url = item.getElementsByTagName('url')[0].textContent;
            const snippet = item.getElementsByTagName('snippet')[0].textContent;
            
            results.push({
                title: title,
                url: url,
                snippet: snippet
            });
        }

        return results;

    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    }
}
    }
    Scratch.extensions.register(new YandexApiExtension());
  })(Scratch);

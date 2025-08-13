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
    }
    Scratch.extensions.register(new YandexApiExtension());
  })(Scratch);

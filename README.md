# Intelligent assistant for blind diagnosis of thyroid nodules
# Изменения
 - В `UploadPage.js` изменил функцию `handleUploadFile`, добавил обращение к своему API
 - В `TabsComponent.js` убрал работу с оверлеями, добавил работу с Annotorious
 - В `Drawer.js` добавил работу с созданием аннотаций по средствам функции `utils/annotationCreator`
 - Добавил работу с ***Redux***, создание `store` и `reducer` лежит в папке `redux`
 - Решил проблему с Annotorious добавлением файла `components/annotorious.min.css`

/*
Массив аннотаций устроен так, что содержит 5 подмассивов
с аннотациями для каждого из типов сегментацй. При этом
id аннотаций сквозные, т.е. не зависят от ее нахождения
в том или ином подмассиве.
Данная функция позволяет получить индекс аннотации в ее 
подмассиве по ее id
*/

const annotationIndexCaclulator = (annotations, id, subArrayIndex) => {
    let summaryLenght = 0 // суммарная длина всех подмассивов, которые стоят раньше рассматриваемого
    for (let i = 0; i < subArrayIndex; i++) {
        summaryLenght += annotations[i].length
    }
    return id - summaryLenght - 1
}

export default annotationIndexCaclulator
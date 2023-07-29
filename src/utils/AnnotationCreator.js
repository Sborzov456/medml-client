const annotationCreator = (segments, source) => {
    const annotations = []
    let id = 1
    let typeIndex = 0
    for(let segmentation of segments) {
        annotations.push([]) //создание массива, в который будут помещены все полигоны, принадлежащие к одному типу
        for (let polygon of segmentation.polygons) {
            const points = polygon.points
            let HTMLPolygon = '<svg><polygon points=\" '
            for (let point of points) {
                HTMLPolygon += point.x + ',' + point.y + ' '
            }
            HTMLPolygon += '\"></polygon></svg>'
            annotations[typeIndex].push({
                type:"Annotation",
                body: [
                    {
                        "type": "TextualBody",
                        "value": "comment",
                        "purpose": "commenting"
                    },
                    {
                        "type": "TextualBody",
                        "value": segmentation.type,
                        "purpose": "tagging"
                    }
                ],
                target: {
                    "source": source,
                    "selector": {
                        "type": "SvgSelector",
                        "value": HTMLPolygon
                    }
                },
                "@context": "http://www.w3.org/ns/anno.jsonld",
                id: id})
            id += 1
        }
        typeIndex += 1
    }
    return annotations  
}

export default annotationCreator
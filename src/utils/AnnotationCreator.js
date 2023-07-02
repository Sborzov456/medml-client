const annotationCreator = (segments, type, source) => {
    const annotations = []
    let id = 0
    const typedSegments = segments[type]
    console.log('TYYYYYPE', type)
    console.log('SEGEEEENTS', typedSegments)
    for (let polygon of typedSegments.polygons) {
        const points = polygon.points
        let HTMLPolygon = '<svg><polygon points=\" '
        for (let point of points) {
            HTMLPolygon += point.x + ',' + point.y + ' '
        }
        HTMLPolygon += '\"></polygon></svg>'
        annotations.push({
            type:"Annotation",
            body: [
                {
                    "type": "TextualBody",
                    "value": "comment",
                    "purpose": "commenting"
                },
                {
                    "type": "TextualBody",
                    "value": type,
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
    return annotations  
}

export default annotationCreator
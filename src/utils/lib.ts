import { FunctionPlotDatum } from "function-plot"

let firstFunctionAsString: string = ""
let secondFunctionAsString: string = ""
let thirdFunctionWithPhAsString: string = ""
let thirdFunctionWithChargeAsString: string = ""
let pointsFromPh: [number, number][] = []
let pointsFromCharge: [number, number][] = []
let pointsGraphPkVsQFromPh: [number, number][] = []
let pointsGraphPkVsQFromCharge: [number, number][] = []

export function compute(pkaInputList: number[], maxCharge: number, isComputePh: boolean,
    chargeOrPh: number): number {

    console.log(typeof maxCharge)

    const pkaList = [...pkaInputList];

    const minCharge = maxCharge - pkaList.length;

    const x1 = 1;
    const x2 = pkaList.length;

    const y1 = -0.5 + maxCharge;
    const y2 = -0.5 * (pkaList.length) + (minCharge + 0.5 * (pkaList.length + 1));

    console.log("list:", pkaList,
        "\nmaxCharge:", maxCharge,
        "\nminCharge:", minCharge,
        "\nx1:", x1,
        "\nx2:", x2,
        "\ny1:", y1,
        "\ny2:", y2)

    //---- graph logic ----//
    firstFunctionAsString = `-0.5x + ${maxCharge}`
    secondFunctionAsString = `-0.5x + (${minCharge} + 0.5 * (${pkaList.length} + 1))`
    //---- graph logic ----//

    if (isComputePh) {
        return computePh(pkaInputList, chargeOrPh, x1, x2, y1, y2, maxCharge, minCharge);
    }

    return computeCharge(pkaInputList, chargeOrPh, x1, x2, y1, y2, maxCharge, minCharge);

}

function computePh(pkaInputList: number[], y: number, x1: number, x2: number, y1: number, y2: number, maxCharge: number, minCharge: number): number {

    const x = (((y - y1) / (y2 - y1)) * (x2 - x1)) + x1;

    console.log("x: ", x)

    //---- graph logic ----//
    thirdFunctionWithPhAsString = `((${y2}-${y1})(x-${x1})+${y1}((${x2}-${x1})))/(${x2}-${x1})`
    pointsFromPh = computePointsFromPh(pkaInputList, x1, x2, y1, y2, false, maxCharge, minCharge)
    pointsGraphPkVsQFromPh = computePointsFromPh(pkaInputList, x1, x2, y1, y2, true, maxCharge, minCharge)
    //---- graph logic ----//

    const integerPart = Math.trunc(x);
    const fractionalPart = x - integerPart;
    const difference = pkaInputList[integerPart] - pkaInputList[integerPart - 1];
    const ph = (difference * fractionalPart) + pkaInputList[integerPart - 1];

    return ph;
}

function computeCharge(pkaInputList: number[], ph: number, x1: number, x2: number, y1: number, y2: number, maxCharge: number, minCharge: number) {

    const x = findXValue(pkaInputList, ph);

    const y = (((x - x1) / (x2 - x1)) * (y2 - y1)) + y1;

    //---- graph logic ----//
    thirdFunctionWithChargeAsString = `(((x - ${x1}) / (${x2} - ${x1})) * (${y2} - ${y1})) + ${y1}`
    pointsFromCharge = computePointsFromCharge(pkaInputList, x1, x2, y1, y2, false, maxCharge, minCharge)
    pointsGraphPkVsQFromCharge = computePointsFromPh(pkaInputList, x1, x2, y1, y2, true, maxCharge, minCharge)
    //---- graph logic ----//

    return y;
}

function findXValue(pkaInputList: number[], ph: number): number {

    let y: number = 0;
    pkaInputList.forEach((pkaValue, index) => {

        if (pkaValue > ph) {
            const missingPart = ph - pkaInputList[index - 1];
            const difference = pkaInputList[index] - pkaInputList[index - 1];
            const k = missingPart / difference; // proportion
            y = k + index;
            return
        }

    });

    return y

}

export function getFirstFunctionAsString(): string {
    return firstFunctionAsString
}

export function getSecondFunctionAsString(): string {
    return secondFunctionAsString
}

export function getThirdFunctionWithPhAsString(): string {
    return thirdFunctionWithPhAsString
}

export function getThirdFunctionWithChargeAsString(): string {
    return thirdFunctionWithChargeAsString
}

function computePointsFromPh(pkaInputList: number[], x1: number, x2: number, y1: number, y2: number, isPutPkaAsPointXCoordinate: boolean, maxCharge: number, minCharge: number): [number, number][] {

    let pointsArray: [number, number][] = []

    let counter = 1
    let maxSize = pkaInputList.length + 1
    if (isPutPkaAsPointXCoordinate) {
        counter = 0
        maxSize -= 1
    }

    pointsArray.push([0, maxCharge])

    console.log(`counter: ${counter}, maxSize: ${maxSize}`)

    for (; counter < maxSize; counter++) {

        let index = counter
        if (isPutPkaAsPointXCoordinate) {
            index += 1
        }

        const y = ((y2 - y1) * (index - x1) + y1 * ((x2 - x1))) / (x2 - x1)

        if (isPutPkaAsPointXCoordinate) {
            pointsArray.push([pkaInputList[counter], y])
        } else {
            pointsArray.push([counter, y])
        }

    }

    if (isPutPkaAsPointXCoordinate) {
        pointsArray.push([14, pointsArray[pointsArray.length - 1][1] - 0.5])
    } else {
        pointsArray.push([pkaInputList.length + 1, minCharge])
    }

    return pointsArray;
}

function computePointsFromCharge(pkaInputList: number[], x1: number, x2: number, y1: number, y2: number, isPutPkaAsPointXCoordinate: boolean, maxCharge: number, minCharge: number): [number, number][] {

    let pointsArray: [number, number][] = []

    let counter = 1
    let maxSize = pkaInputList.length + 1
    if (isPutPkaAsPointXCoordinate) {
        counter = 0
        maxSize -= 1
    }

    pointsArray.push([0, maxCharge])

    console.log(`counter: ${counter}, maxSize: ${maxSize}`)

    for (; counter < maxSize; counter++) {

        let index = counter
        if (isPutPkaAsPointXCoordinate) {
            index += 1
        }

        const y = (((index - x1) / (x2 - x1)) * (y2 - y1)) + y1

        if (isPutPkaAsPointXCoordinate) {
            pointsArray.push([pkaInputList[counter], y])
        } else {
            pointsArray.push([counter, y])
        }

    }

    if (isPutPkaAsPointXCoordinate) {
        pointsArray.push([14, pointsArray[pointsArray.length - 1][1] - 0.5])
    } else {
        pointsArray.push([pkaInputList.length + 1, minCharge])
    }

    return pointsArray;
}

export function getPointsFromPh(): [number, number][] {
    console.log("ph1: ", pointsFromPh)
    return pointsFromPh
}

export function getPointsFromCharge(): [number, number][] {
    console.log("carica1: ", pointsFromCharge)
    return pointsFromCharge
}

export function getPointsGraphPkVsQFromPh(): [number, number][] {
    console.log("ph: ", pointsGraphPkVsQFromPh)
    return pointsGraphPkVsQFromPh
}

export function getPointsGraphPkVsQFromCharge(): [number, number][] {
    console.log("carica: ", pointsGraphPkVsQFromCharge)
    return pointsGraphPkVsQFromCharge
}

function computeLineBetweenTwoPointsEquation(point1: [number, number], point2: [number, number], range: [number, number], color: string): FunctionPlotDatum {

    // point is [x,y]

    return {
        fn: `((x-${point1[0]})(${point2[1]}-${point1[1]})-${point1[1]}(-${point2[0]}+${point1[0]}))/(${point2[0]}-${point1[0]})`,
        range: range,
        color: color
    }

}

export function getFunctionsGraphPkVsQ(points: [number, number][]): FunctionPlotDatum[] {

    let functions: FunctionPlotDatum[] = []

    for (let counter = 0; counter < points.length - 1; counter++) {
        functions.push(computeLineBetweenTwoPointsEquation(points[counter], points[counter + 1], [points[counter][0], points[counter + 1][0]], '#3686bc'))
    }

    return functions

}
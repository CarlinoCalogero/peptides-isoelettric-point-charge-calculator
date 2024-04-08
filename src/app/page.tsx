'use client'

import { compute, deepCopy, getFirstFunctionAsString, getFunctionsGraphPkVsQ, getPointsFromCharge, getPointsFromPh, getPointsGraphPkVsQFromCharge, getPointsGraphPkVsQFromPh, getSecondFunctionAsString, getThirdFunctionWithChargeAsString, getThirdFunctionWithPhAsString } from '@/utils/lib';
import styles from './page.module.css'
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import functionPlot from 'function-plot';

export default function Home() {

  const CHARGE_RADIO_BUTTON_VALUE: string = 'charge'
  const PH_RADIO_BUTTON_VALUE: string = 'ph'

  const [pkaInputList, setPkaInputList] = useState<number[]>([2.15, 3.71, 6.04, 9.58, 10.67])
  const [maxCharge, setMaxCharge] = useState<number | ''>(3)
  const [chargeOrPhValue, setChargeOrPhValue] = useState<number | ''>('')
  const [isCompute, setIsCompute] = useState<boolean>(false)

  const [chargeOrPh, setChargeOrPh] = useState<string>(CHARGE_RADIO_BUTTON_VALUE)

  const [resultValue, setResultValue] = useState<number | null>(null)

  useEffect(() => {
    console.log(pkaInputList)
  }, [pkaInputList])

  useEffect(() => {
    if (isCompute) {



      functionPlot({
        target: "#graph1",
        width: document.getElementById("graph1")?.clientWidth,
        height: document.getElementById("graph1")?.clientHeight,
        disableZoom: true,
        xAxis: {
          label: 'n',
          domain: [0, pkaInputList.length + 1]
        },
        yAxis: {
          label: 'q',
          domain: [Number(maxCharge) - pkaInputList.length - 1, (Number(maxCharge) + 1)]
        },
        data: [
          {
            fn: getFirstFunctionAsString(),
            range: [0, 1],
            color: '#e273f8'
          },
          {
            fn: getSecondFunctionAsString(),
            range: [pkaInputList.length, pkaInputList.length + 1],
            color: '#e273f8'
          },
          {
            fn: chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? getThirdFunctionWithChargeAsString() : getThirdFunctionWithPhAsString(),
            range: [1, pkaInputList.length],
            color: '#3686bc'
          },
          {
            points: chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? getPointsFromCharge() : getPointsFromPh(),
            fnType: 'points',
            graphType: 'scatter',
            color: 'red'
          }
        ]
      })

      functionPlot({
        target: "#graph2",
        width: document.getElementById("graph2")?.clientWidth,
        height: document.getElementById("graph2")?.clientHeight,
        disableZoom: true,
        xAxis: {
          label: 'pK',
          domain: [0, 14]
        },
        yAxis: {
          label: 'q',
          domain: [Number(maxCharge) - pkaInputList.length - 1, (Number(maxCharge) + 1)]
        },
        data: [
          ...getFunctionsGraphPkVsQ(chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? getPointsGraphPkVsQFromCharge() : getPointsGraphPkVsQFromPh()),
          {
            points: chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? getPointsGraphPkVsQFromCharge() : getPointsGraphPkVsQFromPh(),
            fnType: 'points',
            graphType: 'scatter',
            color: 'red'
          },
          {
            graphType: 'text',
            location: [2.15, 2.85],
            text: '(2.15, 2.5)',
            color: '#812074'
          }
        ]
      })

    }
  }, [isCompute])

  function addPkaInputElement() {
    var listDeepCopy: number[] = deepCopy(pkaInputList)
    listDeepCopy.push(0)
    setPkaInputList(listDeepCopy)
  }

  function removePkaInputElement(index: number) {
    var listDeepCopy: number[] = deepCopy(pkaInputList)
    listDeepCopy.splice(index, 1); // 2nd parameter means remove one item only
    setPkaInputList(listDeepCopy)
  }

  function onArrayValueChanged(e: ChangeEvent<HTMLInputElement>, index: number) {
    var listDeepCopy: number[] = deepCopy(pkaInputList)
    listDeepCopy[index] = Number(e.target.value)
    setPkaInputList(listDeepCopy)
  }

  function onMaxChargeChanged(event: ChangeEvent<HTMLInputElement>) {
    setMaxCharge(Number(event.target.value))
  }

  function onChargeOrPhValueChanged(event: ChangeEvent<HTMLInputElement>) {
    setChargeOrPhValue(Number(event.target.value))
  }

  function onChargeOrPhInputRadioChanged(event: ChangeEvent<HTMLInputElement>) {
    setChargeOrPh(event.target.value)
  }

  function computeValues() {
    if (maxCharge != "" && (chargeOrPhValue == 0 || chargeOrPhValue != "")) {

      let isComputePh = false
      if (chargeOrPh == PH_RADIO_BUTTON_VALUE) {
        isComputePh = true
      }
      setResultValue(compute(pkaInputList, maxCharge, isComputePh, chargeOrPhValue))

      if (!isCompute) {
        setIsCompute(true)
      }

    }

  }

  return (
    <div className={styles.pageDiv}>

      <h1>Sono un prosciutto senza senso</h1>

      <div className={styles.outerDiv}>

        <div className={styles.inputOuterDiv}>

          <button onClick={computeValues}>Computa</button>

          {
            resultValue != null &&
            <div className={styles.box}>
              <fieldset>
                <legend>Risultato</legend>
                <span>{`Il valore ${chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? `della carica` : `del ph`} è ${resultValue}`}</span>
              </fieldset>
            </div>
          }

          <div className={`${styles.box} ${styles.inputValuesDiv}`}>

            <fieldset>
              <legend>Calcola</legend>
              <div className={styles.chargeOrPhInputRadioDiv}>
                <div>
                  <input id='chargeRadioButton' type='radio' value={CHARGE_RADIO_BUTTON_VALUE} checked={chargeOrPh == CHARGE_RADIO_BUTTON_VALUE} name='chargeOrPh' onChange={onChargeOrPhInputRadioChanged}></input>
                  <label htmlFor='chargeRadioButton'>Carica</label>
                </div>
                <div>
                  <input id='phRadioButton' type='radio' value={PH_RADIO_BUTTON_VALUE} checked={chargeOrPh == PH_RADIO_BUTTON_VALUE} name='chargeOrPh' onChange={onChargeOrPhInputRadioChanged}></input>
                  <label htmlFor='phRadioButton'>Ph</label>
                </div>
              </div>
              <div className={styles.chargeOrPhInputDiv}>
                <label>{`${chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? `Ph:` : `Carica:`}`}</label>
                <input type='number' value={chargeOrPhValue} onChange={onChargeOrPhValueChanged} />
              </div>
            </fieldset>

            <fieldset>
              <legend>Carica massima</legend>
              <input type='number' value={maxCharge} onChange={onMaxChargeChanged} />
            </fieldset>

            <fieldset>
              <legend>Valori di pKa</legend>
              <div className={styles.pkaInputOuterDiv}>
                {
                  pkaInputList.map((pkaInput, i) => {
                    if (i % 2 == 0) {
                      return <div key={`pkaInputDiv_${i}${i + 1 < pkaInputList.length ? `_and_${i + 1}` : ''}`} className={styles.pkaInputPairDiv}>
                        <div className={styles.pkaInputListDiv}>
                          <span>{i + 1}</span>
                          <input type="number" step="0.01" onChange={(e) => { onArrayValueChanged(e, i) }} value={pkaInput}></input>
                          <button onClick={() => { removePkaInputElement(i) }}>-</button>
                        </div>

                        {
                          i + 1 < pkaInputList.length &&
                          <div className={styles.pkaInputListDiv}>
                            <span>{i + 2}</span>
                            <input type="number" step="0.01" onChange={(e) => { onArrayValueChanged(e, i + 1) }} value={pkaInputList[i + 1]}></input>
                            <button onClick={() => { removePkaInputElement(i + 1) }}>-</button>
                          </div>
                        }
                      </div>
                    }
                    return null
                  })
                }
                <button onClick={addPkaInputElement}>+</button>
              </div>
            </fieldset>

          </div>

        </div>

        {
          isCompute &&
          <div>
            <div id='graph1'></div>
            <div id='graph2'></div>
          </div>
        }

      </div>

      <footer>
        <span>&copy; Made with love while Sara was crying</span>
      </footer>

    </div>
  );
}

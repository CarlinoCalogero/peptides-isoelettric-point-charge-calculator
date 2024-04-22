'use client'

import { compute, getFirstFunctionAsString, getFunctionsGraphPkVsQ, getPointsFromCharge, getPointsFromPh, getPointsGraphPkVsQFromCharge, getPointsGraphPkVsQFromPh, getSecondFunctionAsString, getThirdFunctionWithChargeAsString, getThirdFunctionWithPhAsString } from '@/utils/lib';
import styles from './page.module.css'
import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from "react";
import functionPlot from 'function-plot';

export default function Home() {

  const FORM_INPUT_FIELD_NAMES = {
    CHARGE_OR_PH_VALUE: "chargeOrPhValue",
    MAX_CHARGE_VALUE: "maxChargeValue"
  }

  const CHARGE_RADIO_BUTTON_VALUE: string = 'charge'
  const PH_RADIO_BUTTON_VALUE: string = 'ph'

  const [pkaInputList, setPkaInputList] = useState<number[]>([0, 0])
  const [isCompute, setIsCompute] = useState<boolean>(false)

  const [chargeOrPh, setChargeOrPh] = useState<string>(CHARGE_RADIO_BUTTON_VALUE)

  const [resultValue, setResultValue] = useState<number | null>(null)

  useEffect(() => {
    console.log(pkaInputList)
  }, [pkaInputList])

  function addPkaInputElement() {
    setPkaInputList([...pkaInputList, 0])
  }

  function removePkaInputElement(index: number) {
    var listDeepCopy: number[] = [...pkaInputList]
    listDeepCopy.splice(index, 1); // 2nd parameter means remove one item only
    setPkaInputList(listDeepCopy)
  }

  function onArrayValueChanged(e: ChangeEvent<HTMLInputElement>, index: number) {
    var listDeepCopy: number[] = [...pkaInputList]
    listDeepCopy[index] = Number(e.target.value)
    setPkaInputList(listDeepCopy)
  }

  function onChargeOrPhInputRadioChanged(event: ChangeEvent<HTMLInputElement>) {
    setChargeOrPh(event.target.value)
  }

  function computeValues(chargeOrPhValue: number, maxCharge: number) {

    let isComputePh = false
    if (chargeOrPh == PH_RADIO_BUTTON_VALUE) {
      isComputePh = true
    }
    setResultValue(compute(pkaInputList, maxCharge, isComputePh, chargeOrPhValue))

    if (!isCompute) {
      setIsCompute(true)
    }

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

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const chargeOrPhValue: number = Number(getFormFieldValue(event, FORM_INPUT_FIELD_NAMES.CHARGE_OR_PH_VALUE))
    const maxCharge: number = Number(getFormFieldValue(event, FORM_INPUT_FIELD_NAMES.MAX_CHARGE_VALUE))
    console.log(chargeOrPhValue, maxCharge)
    computeValues(chargeOrPhValue, maxCharge)
  }

  function getFormFieldValue(event: FormEvent<HTMLFormElement>, fieldName: string) {
    return ((event.target as HTMLFormElement).elements as any)[fieldName].value
  }

  return (
    <div className={styles.pageDiv}>

      <div className={`${styles.titleAndDescriptionDiv} ${isCompute ? styles.titleAndDescriptionDivFullSize : null}`}>
        <h1>Calcolatore di punto isolettrico e carica dei peptidi</h1>
        <span>Determinazione del punto isoelettrico e della carica di peptidi a parte da pH 0 fino a 14</span>
      </div>

      {
        resultValue != null &&
        <div className={styles.box}>
          <fieldset>
            <legend>Risultato</legend>
            <span>{`Il valore ${chargeOrPh == CHARGE_RADIO_BUTTON_VALUE ? `della carica` : `del ph`} è ${resultValue}`}</span>
          </fieldset>
        </div>
      }

      <form onSubmit={onFormSubmit} className={`${styles.box} ${styles.inputValuesDiv}`}>

        <input type='submit' value={"Computa"} />

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
            <input type='number' step="0.001" required name={FORM_INPUT_FIELD_NAMES.CHARGE_OR_PH_VALUE} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Carica massima</legend>
          <input type='number' required name={FORM_INPUT_FIELD_NAMES.MAX_CHARGE_VALUE} />
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
                      <input type="number" required step="0.01" onChange={(e) => { onArrayValueChanged(e, i) }} value={pkaInput != 0 ? pkaInput : ""}></input>
                      <input type="button" onClick={() => { removePkaInputElement(i) }} disabled={pkaInputList.length == 2} value={"-"} />
                    </div>

                    {
                      i + 1 < pkaInputList.length &&
                      <div className={styles.pkaInputListDiv}>
                        <span>{i + 2}</span>
                        <input type="number" required step="0.01" onChange={(e) => { onArrayValueChanged(e, i + 1) }} value={pkaInputList[i + 1] != 0 ? pkaInputList[i + 1] : ""}></input>
                        <input type="button" onClick={() => { removePkaInputElement(i + 1) }} disabled={pkaInputList.length == 2} value={"-"} />
                      </div>
                    }
                  </div>
                }
                return null
              })
            }
            <input type="button" onClick={addPkaInputElement} value={"+"} />
          </div>
        </fieldset>

      </form>

      <div>
        <div id='graph1' style={{ display: (isCompute ? 'block' : 'none') }}></div>
        <div id='graph2' style={{ display: (isCompute ? 'block' : 'none') }}></div>
      </div>

      <footer>
        <p>D'Andrea G. And Di Nicolantonio G. ,a graphical approach to Determine the Isoeletric Point and Charge of small peptides from pH 0 to 14. Journal of chemical Education , <b>79</b>(8), 972-975,2002.</p>
        <span>Realizzato da <a href='https://github.com/CarlinoCalogero'>CarlinoCalogero</a> e Alessio Barone</span>
      </footer>

    </div>
  );
}

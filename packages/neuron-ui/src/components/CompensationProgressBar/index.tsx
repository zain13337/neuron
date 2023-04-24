import React, { CSSProperties } from 'react'
import { WITHDRAW_EPOCHS } from 'utils/const'
import { ArrowDownRound } from 'widgets/Icons/icon'
import styles from './compensationProgressBar.module.scss'

export interface CompensationProgressBarProps {
  style?: CSSProperties
  endEpochValue: number
  currentEpochValue: number
  withdrawEpochValue?: number
  pending?: boolean
}

const CompensationProgressBar = ({
  endEpochValue,
  currentEpochValue,
  withdrawEpochValue,
  pending = false,
  style,
}: CompensationProgressBarProps) => {
  if (pending) {
    return (
      <div className={styles.container} style={style}>
        <progress className={styles.pendingProgress} />
      </div>
    )
  }
  const isWithdrawn = withdrawEpochValue !== undefined

  let currentCursor = (WITHDRAW_EPOCHS + currentEpochValue - endEpochValue) % WITHDRAW_EPOCHS

  if (currentEpochValue >= endEpochValue) {
    currentCursor = WITHDRAW_EPOCHS
  } else if (currentCursor < 0) {
    currentCursor = 0
  }

  const withdrawCursor = withdrawEpochValue ? WITHDRAW_EPOCHS + withdrawEpochValue - endEpochValue : currentCursor

  return (
    <div className={styles.container} style={style}>
      <ArrowDownRound
        className={styles.indicator}
        style={{ marginLeft: `${(100 * currentCursor) / WITHDRAW_EPOCHS}%` }}
      />
      <progress
        className={styles.progress}
        max={WITHDRAW_EPOCHS}
        value={withdrawCursor}
        data-is-withdrawn={isWithdrawn}
      />
    </div>
  )
}

CompensationProgressBar.displayName = 'CompensationProgressBar'

export default CompensationProgressBar

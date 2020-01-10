import { BehaviorSubject, Subscription } from 'rxjs'

import Queue from './queue'
import NodeService from 'services/node'
import logger from 'utils/logger'

export default class BlockListener {
  private url: string
  private lockHashes: string[]

  private tipNumberSubject: BehaviorSubject<string | undefined>

  private queue: Queue | undefined
  private tipNumberListener: Subscription | undefined

  constructor(url: string, lockHashes: string[]) {
    this.url = url
    this.lockHashes = lockHashes

    this.tipNumberSubject = NodeService.getInstance().tipNumberSubject
  }

  // start listening
  public start = async () => {
    try {
      this.queue = new Queue(this.url, this.lockHashes)
      this.queue.start()
    } catch (err) {
      logger.error(`BlockListener start error:`, err)
    }

    this.tipNumberListener = this.tipNumberSubject.subscribe(async num => {
      if (num) {
        await this.regenerate(num)
      }
    })
  }

  public stop = () => {
    if (this.tipNumberListener) {
      this.tipNumberListener.unsubscribe()
    }
    if (this.queue) {
      this.queue.stop()
    }
  }

  public stopAndWait = async () => {
    this.stop()
    if (this.queue) {
      await this.queue.waitForDrained()
    }
  }

  private regenerate = async (tipNumber: string): Promise<void> => {
    if (this.queue) {
      if (BigInt(tipNumber) > BigInt(0)) {
        this.queue.expandToTip()
      }
    } else {
      this.queue = new Queue(this.url, this.lockHashes)
      this.queue.start()
    }
  }
}

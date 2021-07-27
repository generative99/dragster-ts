export class Dragster {

    static dragsters: { [index: string]: Dragster }
    destroy: () => void
    first: boolean
    second: boolean
    customEvent: CustomEvent<any> | undefined

    constructor(public el: HTMLElement) {

        this.dragenter = this.dragenter.bind(this)
        this.dragleave = this.dragleave.bind(this)

        this.first = false
        this.second = false

        this.el.addEventListener("dragenter", this.dragenter, false)
        this.el.addEventListener("dragleave", this.dragleave, false)

        this.destroy = this._destroy.bind(this)

        if (!Dragster.dragsters) {
            Dragster.dragsters = {}
        }

        // if (Dragster.dragsters[this.el.id]) {
        //     console.error('WARNING: A Dragster for element with id "%O" has already been instantiated. This replaces that.', this.el.id)
        // }

        Dragster.dragsters[this.el.id] = this
    }

    static getDragster(id: string) {
        return Dragster.dragsters[id]
    }

    static reset(el: HTMLElement) {
        Dragster.dragsters[el.id].reset()
    }

    dragenter(event: any) {
        event.preventDefault()
        if (this.first) {
            this.second = true
        } else {
            this.first = true
            this.customEvent = document.createEvent("CustomEvent")
            this.customEvent.initCustomEvent("dragster:enter", true, true, {
                dataTransfer: event.dataTransfer,
                sourceEvent: event
            })
            this.el.dispatchEvent(this.customEvent)
        }
    }

    dragleave(event: any) {
        if (this.second) {
            this.second = false
        } else if (this.first) {
            this.first = false
        }

        if (!this.first && !this.second) {
            this.customEvent = document.createEvent("CustomEvent")
            this.customEvent.initCustomEvent("dragster:leave", true, true, {
                dataTransfer: event.dataTransfer,
                sourceEvent: event
            })
            this.el.dispatchEvent(this.customEvent)
        }
    }

    removeListeners() {
        this.el.removeEventListener("dragenter", this.dragenter, false)
        return this.el.removeEventListener("dragleave", this.dragleave, false)
    }

    // Must call after drop or a second drop to the same target sometimes gets missed
    reset() {
        this.first = false
        return this.second = false
    }

    _destroy() {
        if (Dragster.dragsters[this.el.id]) {
            Dragster.dragsters[this.el.id].removeListeners()
            delete Dragster.dragsters[this.el.id]
        }
    }
}
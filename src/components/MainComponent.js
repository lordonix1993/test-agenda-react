import React from "react";
import QuillComponent from "./elements/QuillComponent";
import {quills} from "../config/main"

export default class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {quills}
        this.suggestions = []

        window.oncontextmenu = function (e)
        {
            if(e.target.closest(".quill") !== null) {
                return false
            }
        }
    }

    closeAllTooltipsHandle = () => {
        const quills = {}
        Object.keys(this.state.quills).map((quill_key) => {
            quills[quill_key] = this.state.quills[quill_key]
            quills[quill_key].showTooltip = false
        })
        this.setState({
            quills: quills
        })
    }

    showTooltipHandle = (id = null) => {
        const quills = {}
        Object.keys(this.state.quills).map((quill_key) => {
            quills[quill_key] = this.state.quills[quill_key]
            if(id === quill_key) {
                quills[quill_key].showTooltip = true
            }
        })
        this.setState({
            quills: quills
        })
    }

    render() {
        return(
            <div className="appBlock">
                {Object.keys(this.state.quills).map((quill_key) => (
                    <QuillComponent
                        key={quill_key}
                        id={quill_key}
                        showTooltip={this.state.quills[quill_key].showTooltip}
                        placeholder={this.state.quills[quill_key].placeholder}
                        modules={this.state.quills[quill_key].modules}
                        closeAllTootipEmit={this.closeAllTooltipsHandle}
                        showTooltipEmit={this.showTooltipHandle}
                    />
                ))}
            </div>
        )
    }
}
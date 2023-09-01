import React, { Component } from "react";
import styles from "../../styles/tooltipStyles.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

export default class TooltipComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    closeTooltipHandle = () => {
        this.props.closeTooltipEmit()
    }

    addToIgnoreHandle = () => {
        this.props.addToIgnore()
    }

    saveToDictionaryHandle = () => {
        this.props.saveToDictionaryEmit()
        this.closeTooltipHandle()
    }

    changeContentHandle = (suggestion) =>   {
        this.props.changeContentEmit(suggestion)
        this.closeTooltipHandle()
    }

    render() {
        return (
            <>
                {this.props.showTooltip && (
                    <div className={styles.popupModal} style={{
                        top : this.props.positionTooltip.top+'px',
                        left: this.props.positionTooltip.left+'px'
                    }}>
                        <div className={styles.suggests}>
                            {this.props.tooltipSuggestions.length > 0 && (
                                 this.props.tooltipSuggestions.map((suggestion) => (
                                    <span key={suggestion} onClick={() => this.changeContentHandle(suggestion)}>{suggestion}</span>
                                 ))
                            )}
                        </div>
                        <div className={styles.blockButton}>
                            <button
                                onClick={this.saveToDictionaryHandle}
                            ><FontAwesomeIcon icon={faBook} /><span>Add to dictionary</span></button>
                            <button
                                onClick={this.addToIgnoreHandle}
                            ><FontAwesomeIcon icon={faCircleXmark} /><span>Ignore</span></button>
                            <button
                                onClick={this.closeTooltipHandle}
                            ><FontAwesomeIcon icon={faCircleXmark} /><span>close</span></button>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

import React from "react";
import styles from "../../styles/mainStyles.module.css";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class DictionaryComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    setDictHandle = (dict) => {
        this.props.setDictionaryEmit(dict)
    }

    deleteDictHandle = (index) => {
        this.props.removeFromDictionaryEmit(index)
    }

    render() {
        return (
            <div className={styles.dict_pos}>
                <div>
                    Dictionary:
                </div>
                {this.props.dictionaryList != null && (
                    this.props.dictionaryList.map((dict,index) => (
                        <span className={styles.dict_word}>
                            <span  key={dict} onClick={() => this.setDictHandle(dict)} >{dict}</span>
                            <span onClick={() => this.deleteDictHandle(index)}> <FontAwesomeIcon icon={faCircleXmark} /></span>
                        </span>
                    ))
                )}
            </div>
        );
    }
}

import React from "react";
import styles from '../../styles/mainStyles.module.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TooltipComponent from "./TooltipComponent"
import DictionaryComponent from "./DictionaryComponent"
import {getCurrentWord, getListIdx} from '../../helpers/common'
import {getSuggestionsRequest} from "../../actions/requests";

export default class QuillComponent extends React.Component {
    constructor(props) {
        super(props);
        this.reactQuillRef = null;
        this.quillRef = null;
        this.tooltipSuggestions = {}
        this.ignoreList = []
        this.rangeContent = {}
        this.cursorRange = {}
        this.word = null
        this.state = {
            dictionaryList:JSON.parse(localStorage.getItem(this.props.id)),
            textQuill: "",
            showTooltip: this.props.showTooltip,
            tooltipSuggestions: [],
            positionTooltip: {
                top: 0,
                left: 0
            },
        };
        this.suggestions = []
    }

    checkText = () => {
        let content = this.quillRef.getText();
        this.getSuggestions({'text' : content,'language':this.props.id});
    }

    addToIgnoreList = () => {
        this.ignoreList.push(this.word)
        this.checkText()
        this.closeTooltipHandle()
    }

    saveToDictionaryHandle = () => {
        let dictionary = JSON.parse(localStorage.getItem(this.props.id))
        if(!dictionary) dictionary = [];
        dictionary.push(this.word)
        dictionary = [...new Set(dictionary)]
        localStorage.setItem(this.props.id,JSON.stringify(dictionary))
        this.setState({dictionaryList: dictionary})
        this.closeTooltipHandle()
    }

    closeTooltipHandle = () => {
        this.props.closeAllTootipEmit()
    }

    changeContentHandle = (suggestion) => {
        this.quillRef.deleteText(this.rangeContent.index, this.rangeContent.length);
        this.quillRef.insertText(this.rangeContent.index, suggestion);
        this.closeTooltipHandle()
    }

    handleChangeSelection = (range,source) =>  {
        const fullText = this.quillRef.getText()

        if(fullText != this.state.textQuill) {
            this.closeTooltipHandle()
            this.setState({textQuill: fullText})
        }

        if (range !== null) {
            this.cursorRange = range
            this.rangeContent = range
            this.setState({showTooltip: false})
        }

        if (range !== null && source === 'user' &&  range.index + 1 !== this.quillRef.getLength()) {
            let rangeNew = range.length == 0 ? getCurrentWord(range, fullText) : null
            if(rangeNew !== null) {
                this.rangeContent = rangeNew
                const selectedContent = this.quillRef.getText(rangeNew.index, rangeNew.length)
                this.word = selectedContent

                if(selectedContent && this.ignoreList.indexOf(selectedContent) === -1) {
                    for (const child of this.suggestions) {
                        if (child['original'] === selectedContent) {
                            this.tooltipSuggestions = child['suggestions']
                            this.showTooltipHandle(rangeNew)
                        }
                    }
                }
            }
        }
    }

    showTooltipHandle = (range) => {
        this.props.closeAllTootipEmit()
        let tooltip = this.quillRef.getBounds(range.index)
        this.props.showTooltipEmit(this.props.id)

        this.setState({
            tooltipSuggestions: this.tooltipSuggestions,
            positionTooltip: {
                top: tooltip.bottom + 10,
                left: tooltip.left
            }
        })
    }

    componentDidMount() {
        this.attachQuillRefs();
    }

    componentDidUpdate() {
        this.attachQuillRefs();
    }

    attachQuillRefs = () => {
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        this.quillRef = this.reactQuillRef.getEditor();
    }

    removeFromDictionary  = (key) => {
        let dictionary = JSON.parse(localStorage.getItem(this.props.id))
        dictionary.splice(key, 1);
        dictionary = [...new Set(dictionary)]
        localStorage.setItem(this.props.id,JSON.stringify(dictionary))
        this.setState({dictionaryList: dictionary})
    }

    setFromDictionary  = (dict) => {
        if(this.cursorRange.length > 0) {
            this.rangeContent = this.cursorRange
            this.changeContentHandle(dict)
        } else {
            this.quillRef.insertText(this.cursorRange.index ?? this.quillRef.getLength() - 1, dict+' ');
            this.closeTooltipHandle()
        }
    }

    getSuggestions = async (data) => {
        try {
            const res = await getSuggestionsRequest(data)
            this.suggestions = res.data
            this.quillRef.removeFormat(0,this.quillRef.getText().length - 1)
            for (const child of this.suggestions) {
                if (this.ignoreList.indexOf(child['original']) === -1) {
                    let ranges = getListIdx(child['original'], this.quillRef.getText())
                    for (const range of ranges) {
                        if (range['index'] !== -1) this.quillRef.formatText(range['index'], range['length'], {"color": "red"}, true);
                    }
                }
            }
        } catch(e) {
            this.suggestions = []
        }
    }

    render() {
        return (
            <div className={styles.textArea}>
                <DictionaryComponent
                    setDictionaryEmit = {this.setFromDictionary}
                    removeFromDictionaryEmit = {this.removeFromDictionary}
                    dictionaryList={this.state.dictionaryList}
                />
                <div className={styles.dict_block}>
                    <ReactQuill
                        className={"editor_"+this.props.id}
                        ref={(el) => {
                            this.reactQuillRef = el;
                        }}
                        theme={'snow'}
                        modules={this.props.modules}
                        onKeyUp={this.checkText}
                        placeholder={this.props.placeholder}
                        onChangeSelection={this.handleChangeSelection}
                    />
                    <div className="tooltipBlock">
                        <TooltipComponent
                            saveToDictionaryEmit = {this.saveToDictionaryHandle}
                            changeContentEmit = {this.changeContentHandle}
                            closeTooltipEmit = {this.closeTooltipHandle}
                            showTooltip={this.props.showTooltip}
                            addToIgnore={this.addToIgnoreList}
                            positionTooltip={this.state.positionTooltip}
                            tooltipSuggestions={this.tooltipSuggestions}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

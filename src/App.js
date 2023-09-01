import './App.css';
import React, { Component, useState } from "react";
import MainComponent from "./components/MainComponent";

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <MainComponent />
        )
    }
}
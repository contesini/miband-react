import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeBluetooth, changeName, changeId } from './actions'
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box'
import If from "./template/if";
import ButtonConnectart from './template/buttonConnectar'
import ButtonIniciarTreino from './template/buttonIniciarTreino'
import ButtonFinalizarTreino from './template/buttonFinalizarTreino'
import ButtonNotificar from './template/buttonNotificar'
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.props.changeBluetooth(navigator.bluetooth)
  }

  render() {
    const splitUrl = window.location.href.split('/')
    if (splitUrl.length === 5) {
      this.props.changeName(splitUrl[4])
      this.props.changeId(splitUrl[3])
    }

    return (
      <Box className="App" justifyContent="flex-start">
        <If hidden={!this.props.name}>
          <h1>{this.props.name}</h1>
        </If>
        <div className='button-padding'>
          <Icon>favorite</Icon> : <strong>{this.props.hearthBeat}</strong>
        </div>
        <If hidden={this.props.device !== null}>
          <div className='button-padding'>
            <ButtonConnectart />
          </div>
        </If>
        <If hidden={this.props.isTreinoStarted || this.props.device === null}>
          <div className='button-padding'>
            <ButtonIniciarTreino />
          </div>
        </If>
        <If hidden={!this.props.isTreinoStarted || this.props.device === null}>
          <div className='button-padding'>
            <ButtonFinalizarTreino />
          </div>
        </If>
        <If hidden={this.props.device === null}>
          <div className='button-padding'>
            <ButtonNotificar />
          </div>
        </If>
      </Box>
    );
  }

}

const mapStateToProps = state => ({
  id: state.user.id,
  name: state.user.name,
  hearthBeat: state.user.hearthBeat,
  device: state.user.device,
  isTreinoStarted: state.user.isTreinoStarted
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeBluetooth, changeName, changeId }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(App);

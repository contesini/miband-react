import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeBluetooth, changeName, changeId, changeLoading } from './actions'
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress';
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
    this.props.changeLoading(false)
  }

  render() {
    const splitUrl = window.location.search.split('?')
    if (splitUrl.length === 2) {
      this.props.changeId(splitUrl[1].split(':')[0])
      this.props.changeName(splitUrl[1].split(':')[1])
    }

    return (
      <div className="App">
        <If hidden={!this.props.loading}>
          <CircularProgress />
        </If>
        <If hidden={this.props.loading}>
          <Box  justifyContent="flex-start">
            {/* <h1>Pulseira: {this.props.serial}</h1> */}
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
        </If>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  id: state.user.id,
  name: state.user.name,
  hearthBeat: state.user.hearthBeat,
  device: state.user.device,
  isTreinoStarted: state.user.isTreinoStarted,
  loading: state.user.loading
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeBluetooth, changeName, changeId, changeLoading }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(App);

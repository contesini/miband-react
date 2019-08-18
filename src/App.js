import React from 'react';
import MiBand from 'miband';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeId, changeHearthBeat, changeName, changeMiband, changeBluetooth, changeDevice, changeTreinoStatus } from './actions'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box'
import If from "./template/if";
import ButtonConnectart from './template/buttonConnectar'
import ButtonIniciarTreino from './template/buttonIniciarTreino'
import ButtonFinalizarTreino from './template/buttonFinalizarTreino'
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.startHrm = this.startHrm.bind(this)
    this.endHrm = this.endHrm.bind(this)
    this.scan = this.scan.bind(this)
    this.props.changeBluetooth(navigator.bluetooth)
    this.notigicarPulseira = this.notigicarPulseira.bind(this)
  }

  startHrm = async (log) => {
    try {
      log('Connecting to the device...');
      if (!this.props.miband) {
        const server = await this.props.device.gatt.connect();
        log('Connected');
        let miband = new MiBand(server);
        await miband.init();
        miband.on('heart_rate', (rate) => {
          log('Heart Rate:', rate)
          this.props.changeHearthBeat(rate)
        })
        this.props.changeMiband(miband)
      }
      await this.props.changeTreinoStatus(true)
      await this.props.miband.hrmStart()
    } catch (error) {
      log('Argh!', error);
      log('Argh!', error.message);
    }
  }

  async notigicarPulseira(log) {
    if (this.props.miband) {
      this.props.miband.showNotification('message');
    } else {
      const server = await this.props.device.gatt.connect();
      let miband = new MiBand(server);
      this.props.changeMiband(miband)
      await miband.init();
      miband.showNotification('message');
    }
  }

  endHrm = async (log) => {
    log('end hrm')
    await this.props.miband.hrmStop()
    await this.props.changeTreinoStatus(false)
    await this.props.changeMiband(null)
    log('disconnect device')
  }

  async scan(log) {
    if (!this.props.bluetooth) {
      log('WebBluetooth is not supported by your browser!');
      return;
    }
    log('Requesting Bluetooth Device...');
    if (!this.props.device) {
      const device = await this.props.bluetooth.requestDevice({
        filters: [
          { services: [MiBand.advertisementService] }
        ],
        optionalServices: MiBand.optionalServices
      });
      this.props.changeDevice(device)
    }

    this.props.device.addEventListener('gattserverdisconnected', async () => {
      log('Device disconnected');
      await this.props.device.gatt.disconnect();
      this.startHrm(log, this.props.device)
    });

    await this.props.device.gatt.disconnect();
  }

  render() {
    return (
      <Box className="App" justifyContent="flex-start">
        {/* <h1>Pulseira: {this.props.serial}</h1>
        <h1>{this.props.name} - {this.props.id}</h1> */}
        <div className='button-padding'>
          <Icon>favorite</Icon> : <strong>{this.props.hearthBeat}</strong>
        </div>
        <If hidden={this.props.device !== null}>
          <div className='button-padding'>
            {/* <Button variant="contained" color="primary" onClick={() => this.scan(console.log)}>Conectar</Button> */}
            <ButtonConnectart />
          </div>
        </If>
        <If hidden={this.props.isTreinoStarted || this.props.device === null}>
          <div className='button-padding'>
            {/* <Button variant="contained" color="primary" onClick={() => this.startHrm(console.log)}>Iniciar Treino</Button> */}
            <ButtonIniciarTreino />
          </div>
        </If>
        <If hidden={!this.props.isTreinoStarted || this.props.device === null}>
          <div className='button-padding'>
            {/* <Button variant="contained" color="primary" onClick={() => this.endHrm(console.log)}>Finalizar Treino</Button> */}
            <ButtonFinalizarTreino />
          </div>
        </If>
        <If hidden={this.props.device === null}>
          <div className='button-padding'>
            <Button variant="contained" color="primary" onClick={() => this.notigicarPulseira(console.log)}>Notificar Pulseira</Button>
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
  miband: state.user.miband,
  bluetooth: state.user.bluetooth,
  isTreinoStarted: state.user.isTreinoStarted
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeId, changeHearthBeat, changeName, changeMiband, changeBluetooth, changeDevice, changeTreinoStatus }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(App);

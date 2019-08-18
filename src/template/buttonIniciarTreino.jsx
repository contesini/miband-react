

import React from 'react'
import Button from '@material-ui/core/Button';
import MiBand from 'miband';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeHearthBeat, changeTreinoStatus, changeMiband } from '../actions'


class ButtonIniciarTreino extends React.Component {

    constructor(props) {
        super(props)
        this.startHrm = this.startHrm.bind(this)
    }

    startHrm = async (log) => {
        try {
            await this.props.changeTreinoStatus(true)
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
            await this.props.miband.hrmStart()
        } catch (error) {
            log('Argh!', error.message || error);
            await this.props.changeTreinoStatus(false)
        }
    }

    render() {
        return (
            <Button variant="contained" color="primary" onClick={() => this.startHrm(console.log)}>Iniciar Treino</Button>
        )
    }

}

const mapStateToProps = state => ({
    device: state.user.device,
    miband: state.user.miband,
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeHearthBeat, changeTreinoStatus, changeMiband }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ButtonIniciarTreino);


import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button';
import MiBand from 'miband';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeHearthBeat, changeTreinoStatus, changeMiband, changeLoading } from '../actions'
import { withSnackbar } from 'notistack';

let count = 0;
let retry = 0;

class ButtonIniciarTreino extends React.Component {

    constructor(props) {
        super(props)
        this.startHrm = this.startHrm.bind(this)
    }

    startHrm = async (log) => {
        this.props.changeLoading(true)
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
                miband.on('button', () => {
                    log('button tapped, count: ', count)
                    count += 1;
                    setTimeout(() => count = 0, 3000)
                    if (count > 1) {
                        const action = (key) => (
                            <Fragment>
                                <Button onClick={() => { this.props.closeSnackbar(key) }}>
                                    {'Fechar'}
                                </Button>
                            </Fragment>
                        );
                        this.props.enqueueSnackbar('Usuario precisa de ajuda', { variant: 'warning', action, autoHideDuration: null });
                        count = 0;
                    }
                })
                this.props.changeMiband(miband)
                await miband.hrmStart()
                this.props.changeLoading(false)
            } else {
                await this.props.miband.hrmStart()
                this.props.changeLoading(false)
            }
        } catch (error) {
            log('Argh!', error.message || error);
            if (retry > 8) {
                await this.props.changeTreinoStatus(false)
                this.props.enqueueSnackbar('Ocorreu um erro tente novamente', { variant: 'error' });
                retry = 0
                this.props.changeLoading(false)
            } else {
                retry += 1;
                log('Retrying ...')
                this.startHrm(log)
            }
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

const mapDispatchToProps = dispatch => bindActionCreators({ changeHearthBeat, changeTreinoStatus, changeMiband, changeLoading }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ButtonIniciarTreino));
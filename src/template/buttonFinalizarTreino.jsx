
import React from 'react'
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeTreinoStatus, changeMiband, changeLoading } from '../actions'


class ButtonFinalizarTreino extends React.Component {
    constructor(props) {
        super(props)
        this.endHrm = this.endHrm.bind(this)
    }

    endHrm = async (log) => {
        this.props.changeLoading(true)
        log('end hrm')
        try {
            await this.props.miband.hrmStop()
            await this.props.changeTreinoStatus(false)
            this.props.changeLoading(false)
            await this.props.changeMiband(null)
        } catch (error) {
            await this.props.changeTreinoStatus(false)
            this.props.changeLoading(false)
        }
        log('disconnect device')
    }

    render() {
        return (
            <Button variant="contained" color="primary" onClick={() => this.endHrm(console.log)}>Finalizar Treino</Button>
        )
    }
}


const mapStateToProps = state => ({
    miband: state.user.miband,
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeTreinoStatus, changeMiband, changeLoading }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ButtonFinalizarTreino);
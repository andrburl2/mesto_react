import { React, PureComponent } from 'react';
import './popupWithForm.css';

import { api } from '../../utils/api';
import validate from '../../utils/validation';

class AddPlacePopup extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      link: '',
      errors: {
        title: '',
        link: '',
      },
      isFormValid: false,
      message: '',
    }
  }

  submitForm = (e) => {
    e.preventDefault();

    api.addCard(this.state.title, this.state.link)
      .then(data => {
        if (data.status === 201) {
          this.props.addNewCard(data.card);
          this.closePopup();
          return
        }

        this.setState({ message: data.message });
      });
  }

  closePopup = () => {
    this.props.onClose();

    this.setState({
      title: '',
      link: '',
      errors: {
        title: '',
        link: '',
      },
      isFormValid: false,
      message: '',
    });
  }
  
  handleChange = (e) => {
    const validity = validate(e.target);
    const errors = this.state.errors;
    errors[e.target.name] = validity.error;

    this.setState({
      [e.target.name]: e.target.value,
      errors: errors,
      isFormValid: validity.isFormValid,
      message: '',
    })
  }

  render() {
    const { isOpen } = this.props;

    return (
      <div className={ `popup ${isOpen ? 'popup_is-opened' : ''}` }>
        <div className='popup__content'>
          <button className='popup__close' onClick={this.closePopup} title='Закрыть окно'></button>
          <h3 className='popup__title'>Новое место</h3>

          <form className='popup__form' name='addPlace' onSubmit={this.submitForm}>
            <input
              className='input popup__input'
              aria-label='Название'
              name='title'
              value={this.state.title}
              onChange={this.handleChange}
              required
              type='text'
              minLength='2'
              maxLength='30'
              placeholder='Название'
            />
            <p className='popup__error'>{this.state.errors.title}</p>

            <input
              className='input popup__input'
              aria-label='Ссылка на картинку'
              name='link'
              value={this.state.link}
              onChange={this.handleChange}
              required
              type='url'
              placeholder='Ссылка на картинку'
            />
            <p className='popup__error'>{this.state.errors.link}</p>

            <p className='popup__message'>{this.state.message}</p>

            <button
              className={`button popup__button ${this.state.isFormValid ? 'popup__button_active' : ''}`}
              type='submit'
              disabled={!this.state.isFormValid}
            >
              Добавить
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddPlacePopup;

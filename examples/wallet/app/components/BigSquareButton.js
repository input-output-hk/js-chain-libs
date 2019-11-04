// @flow
import React, { Component } from 'react';
import SVGInline from 'react-svg-inline';
import classnames from 'classnames';
import styles from './BigSquareButton.scss';

type Props = {
  label: string,
  description: string,
  icon: string,
  onClick?: void => void,
  isDisabled?: boolean,
  className?: string
};

export default class BigSquareButton extends Component<Props> {
  render() {
    const {
      label,
      description,
      icon,
      onClick,
      isDisabled = false,
      className
    } = this.props;
    const componentClasses = classnames([
      className,
      styles.component,
      isDisabled ? styles.disabled : null
    ]);
    return (
      <button
        type="button"
        className={componentClasses}
        onClick={onClick}
        disabled={isDisabled}
      >
        <SVGInline svg={icon} className={styles.icon} />
        <div className={styles.label}>{label}</div>
        <div className={styles.description}>{description}</div>
      </button>
    );
  }
}

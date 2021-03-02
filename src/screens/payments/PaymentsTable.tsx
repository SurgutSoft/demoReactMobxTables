import React from 'react';
import linkIcon from "../../assets/images/link.svg";
import moment from 'moment';
import {IDonation} from "../../intarfaces/IPayments";
import {formatAmount} from "../../utils";
import css from "./Payments.module.scss"
import {FormOutlined} from "@ant-design/icons";

interface IProps {
  donations: Array<IDonation>,
  onBeneficiaryChange: (id: number, item: IDonation) => void;
}

export const PaymentsTable = ({donations, onBeneficiaryChange}: IProps) => {
  return <table className="table">
    <thead>
    <tr>
      <th>ID</th>
      <th>AMOUNT</th>
      <th>FEE</th>
      <th>DONOR</th>
      <th>MESSAGE</th>
      <th>DATE</th>
      <th>FUNDRAISER</th>
      <th>BENEFICIARY</th>
      <th>CORP</th>
      <th>HIDDEN</th>
      <th>STRIPE ACCOUNT</th>
      <th className="nowrap">STRIPE PAYMENT</th>
    </tr>
    </thead>

    <tbody>
    {donations.map(item => (
      <TableRow item={item} key={item.payment.id} onBeneficiaryChange={onBeneficiaryChange}/>
    ))}
    </tbody>
  </table>
}


interface IRowProps {
  item: IDonation,
  onBeneficiaryChange: (id: number, item: IDonation) => void;
}

const TableRow = ({item, onBeneficiaryChange}: IRowProps) => {

  const openMemberEditDialog = () => {
    const userId = Number.parseInt(
      prompt("Enter new Beneficiary User ID", item.payment.beneficiary.id + '') + ''
    );
    if (userId > 0) onBeneficiaryChange(userId, item);
  }

  return (
    <tr key={item.payment.id}>

      <td>
        {item.payment.id}
      </td>
      <td>
        <strong>{formatAmount(item.stripeCharge.chargeAmount, item.event.currency)}</strong>
      </td>

      <td>
        <strong className="accent">{formatAmount(item.stripeCharge.feeAmount, item.event.currency)}</strong>
      </td>

      <td>
        {moment(item.payment.created).format('MM/DD/YYYY HH:mm')}
      </td>

      <td>
        {item.payment.donorName}<br/>
        <small className="textSecondary">{item.payment.donorEmail}</small>
      </td>

      <td className={css.donorMessage}>
        <small>{item.payment.donorMessage}</small>
      </td>

      <td>
        <a href={`?eventId=${item.event.id}`}>
          {item.event.name}
        </a>
      </td>

      <td>
        {item.payment.beneficiary &&
        <a href={`/admin/users?search=id=${item.payment.beneficiary.id}`}>
          {item.payment.beneficiary.displayName} ({item.payment.beneficiary.role})
        </a>}
        &nbsp;
        <a onClick={openMemberEditDialog}><FormOutlined/></a>
      </td>

      <td>
        {item.payment.matchCorp ? <span>yes</span> : <span className="disabled">no</span>}
      </td>

      <td>
        {item.payment.public ? <span className="disabled">no</span> : <span>yes</span>}
      </td>

      <td>
        {item.stripeAccount.displayName}<br/>
        <small className="textSecondary">{item.stripeAccount.email}</small>
      </td>

      <td>

        <a title="Go to Stripe payment details"
           href={`https://dashboard.stripe.com/${item.stripeAccount.accountId}/payments/${item.stripeCharge.chargeId}`}
           target="_blank">
          View&nbsp;<img className="link" src={linkIcon} alt="img"/>
        </a>
      </td>

    </tr>
  )
}


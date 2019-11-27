// @flow
import typeof { redirectToFirstAppPage as RedirectToFirstAppPage } from '../actions/router';

type Props = {
  redirectToFirstAppPage: RedirectToFirstAppPage
};

export default ({ redirectToFirstAppPage }: Props) => {
  redirectToFirstAppPage();
  return null;
};

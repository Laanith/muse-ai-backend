const shouldRenewSubcriptionPlan = (user) => {
  const today = new Date();
  //if one month from registration is not yet completed then no need of renewal
  //this returns (registeredmonth<today) i.e still on free trail then no need of subscription therfore negation of the sentence will be returned
  return !user?.nextBillingDate || user?.nextBillingDate <= today;
};

module.exports = { shouldRenewSubcriptionPlan };

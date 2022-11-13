import datetime
import dateutil.relativedelta

dt1 = datetime.datetime.fromtimestamp(1397082900) # 1973-11-29 22:33:09
dt2 = datetime.datetime.fromtimestamp(1397092500) # 1977-06-07 23:44:50
rd = dateutil.relativedelta.relativedelta (dt2, dt1)

if int(rd.years) == 0:
    print("zero")
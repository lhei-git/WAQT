from datetime import date
import datetime
from dateutil.relativedelta import relativedelta
month2quarter = {
        1:1,2:1,3:1,
        4:2,5:2,6:2,
        7:3,8:3,9:3,
        10:4,11:4,12:4,
    }.get

CURRENT_DATE = date.today()

print("Q"+str(month2quarter(CURRENT_DATE.month - 6))+str(CURRENT_DATE.year))
print(CURRENT_DATE - relativedelta(years=2))

ts = int(1464622548000)
print(datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))


echo './uglifyjs \'

filename='dependency.log'
filelines=`cat $filename`
for line in $filelines ; do
    echo $line '\'
done
	echo -o test.min.js